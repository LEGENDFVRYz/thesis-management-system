<?php

namespace App\Http\Controllers\Faculty\Coordinator\ThesisMonitoring;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ProgressReports extends Controller
{
    public function index(Request $request)
    {
        $course = $request->input('course', 'MOR');

        $submissions = DB::table('tbl_endorsements as e')
            ->join('tbl_theses as t', 'e.thesis_id', '=', 't.id')
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->where('def.course', $course)
            ->selectRaw("YEAR(t.created_at) as year, COUNT(e.id) AS submission_count")
            ->groupBy(DB::raw('YEAR(t.created_at)'))
            ->orderBy('year')
            ->get()
            ->map(fn ($item) => ['year' => (int) $item->year, 'submission_count' => (int) $item->submission_count]);

        $completed = DB::table('tbl_endorsements as e')
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->join('tbl_defense_evaluations as eval', 'def.id', '=', 'eval.defense_id')
            ->where('def.course', $course)
            ->whereRaw("UPPER(eval.remarks) LIKE '%APPROVED%'")
            ->selectRaw("YEAR(def.defense_schedule) as year, COUNT(eval.id) AS completed_count")
            ->groupBy(DB::raw('YEAR(def.defense_schedule)'))
            ->orderBy('year')
            ->get()
            ->map(fn ($item) => ['year' => (int) $item->year, 'completed_count' => (int) $item->completed_count]);

        if ($submissions->isEmpty()) $submissions = [['year' => (int) date('Y'), 'submission_count' => 0]];
        if ($completed->isEmpty()) $completed = [['year' => (int) date('Y'), 'completed_count' => 0]];

        return Inertia::render('Faculty/management/coordinator/thesis_monitoring/progress', [
            'course' => $course,
            'submission' => $submissions,
            'completed'  => $completed,
        ]);
    }

    public function generate(Request $request)
    {
        $type = $request->input('type', 'summary'); 
        $yearInput = $request->input('year', '2025 - 2026');
        
        if ($type === 'monthly' && $yearInput === 'all') {
            $yearInput = '2025 - 2026';
        }

        $startYear = (int) explode(' - ', $yearInput)[0];

        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year');
            
        $activeYear = $activeYear ?? 2025;

        $chairperson = DB::table('users')
            ->join('tbl_faculties as f', 'users.id', '=', 'f.user_id')
            ->join('tbl_faculty_assignments as fa', 'f.id', '=', 'fa.faculty_id')
            ->where('fa.role_id', '1')->value('users.name') ?? 'CPE Chairperson';

        $filters = [
            'year' => $yearInput,
            'generated_at' => Carbon::now()->format('F d, Y h:i A'),
            'coordinator' => auth()->user()->name ?? 'Coordinator Name',
            'chairperson'   => $chairperson,
            'department'  => 'Department of Computer Engineering',
            'courses'     => explode(',', $request->input('courses', 'MOR,DP1,DP2')),
            'include_submissions' => filter_var($request->input('include_submissions', true), FILTER_VALIDATE_BOOLEAN),
            'include_completions' => filter_var($request->input('include_completions', true), FILTER_VALIDATE_BOOLEAN),
        ];

        $data = $type === 'monthly' 
            ? $this->getMonthlyData($startYear, $filters['courses'], $activeYear) 
            : $this->getSummaryData($startYear, $filters['courses'], $activeYear);

        $pdf = Pdf::loadView('pdf.layouts.progress_report', compact('type', 'filters', 'data'))
                  ->setPaper('a4', 'portrait');

        return $pdf->stream('thesis-report-' . now()->format('Ymd_His') . '.pdf');
    }

    private function getSummaryData(int $year, array $courses, int $activeYear): array
    {
        $startDate = Carbon::create($year, 8, 1)->startOfDay();
        $endDate   = Carbon::create($year + 1, 7, 31)->endOfDay();

        // 1. Get Distinct Raw Sections (e.g., "1", "2", "A", "B")
        // We removed the strict year calculation here to prevent it from hiding 4th years
        $rawSections = DB::table('tbl_students as s')
            ->join('tbl_thesis_groups as tg', 's.group_id', '=', 'tg.id')
            ->join('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->where('sy.year', $activeYear)
            ->select('s.section')
            ->distinct()
            ->orderBy('s.section')
            ->pluck('section'); // Returns array like ['1', '2', '3']

        // 2. Build the Skeleton (Force correct labels per course)
        $sectionBreakdown = [];
        foreach ($courses as $c) $sectionBreakdown[$c] = [];

        foreach ($rawSections as $secRaw) {
            // Generate MOR rows (3rd Year)
            if (in_array('MOR', $courses)) {
                $sectionBreakdown['MOR'][] = [
                    'section'     => "BSCPE 3-{$secRaw}", // Force Year 3 Label
                    'submissions' => 0,
                    'completed'   => 0,
                    'rate'        => '0%'
                ];
            }

            // Generate DP1/DP2 rows (4th Year)
            // We assume the same section numbers exist for 4th year
            if (in_array('DP1', $courses)) {
                $sectionBreakdown['DP1'][] = [
                    'section'     => "BSCPE 4-{$secRaw}", // Force Year 4 Label
                    'submissions' => 0,
                    'completed'   => 0,
                    'rate'        => '0%'
                ];
            }
            if (in_array('DP2', $courses)) {
                $sectionBreakdown['DP2'][] = [
                    'section'     => "BSCPE 4-{$secRaw}", // Force Year 4 Label
                    'submissions' => 0,
                    'completed'   => 0,
                    'rate'        => '0%'
                ];
            }
        }

        // 3. Get Actual Stats
        $stats = DB::table('tbl_theses as t')
            ->join('tbl_endorsements as e', 't.id', '=', 'e.thesis_id')
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->leftJoin('tbl_defense_evaluations as eval', 'def.id', '=', 'eval.defense_id')
            ->join('tbl_proposals as p', 't.proposal_id', '=', 'p.id')
            ->join('tbl_thesis_groups as tg', 'p.group_id', '=', 'tg.id')
            ->join('tbl_students as s', 'tg.id', '=', 's.group_id')
            ->whereBetween('t.created_at', [$startDate, $endDate])
            ->whereIn('def.course', $courses)
            ->select(
                'def.course',
                's.section', // Get raw section to match our new logic
                DB::raw('COUNT(DISTINCT t.id) as submissions'),
                DB::raw("COUNT(DISTINCT CASE WHEN UPPER(eval.remarks) LIKE '%APPROVED%' THEN t.id END) as completed")
            )
            ->groupBy('def.course', 's.section')
            ->get();

        // 4. Merge Stats
        $totalSub = 0;
        $totalComp = 0;

        foreach ($stats as $stat) {
            $totalSub += $stat->submissions;
            $totalComp += $stat->completed;

            // Determine the constructed name based on the course returned by DB
            $yearPrefix = ($stat->course === 'MOR') ? '3' : '4';
            $constructedName = "BSCPE {$yearPrefix}-{$stat->section}";

            if (isset($sectionBreakdown[$stat->course])) {
                foreach ($sectionBreakdown[$stat->course] as &$row) {
                    if ($row['section'] === $constructedName) {
                        $row['submissions'] = $stat->submissions;
                        $row['completed']   = $stat->completed;
                        $row['rate']        = $stat->submissions > 0 
                            ? round(($stat->completed / $stat->submissions) * 100) . '%' 
                            : '0%';
                        break; 
                    }
                }
            }
        }

        return [
            'total_submissions' => $totalSub,
            'total_completed'   => $totalComp,
            'completion_rate'   => $totalSub > 0 ? round(($totalComp / $totalSub) * 100) . '%' : '0%',
            'section_breakdown' => $sectionBreakdown
        ];
    }

    private function getMonthlyData(int $year, array $courses, int $activeYear): array
    {
        $months = [];
        $start = Carbon::create($year, 8, 1);
        
        for ($i = 0; $i < 10; $i++) {
            $date = $start->copy()->addMonths($i);
            $months[$date->format('F')] = [
                'start' => $date->startOfMonth()->format('Y-m-d'),
                'end' => $date->endOfMonth()->format('Y-m-d'),
            ];
        }

        $allEndorsedData = DB::table('tbl_endorsements as e')
            ->join('tbl_theses as t', 'e.thesis_id', '=', 't.id')
            ->join('tbl_proposals as p', 't.proposal_id', '=', 'p.id')
            ->join('tbl_thesis_groups as tg', 'p.group_id', '=', 'tg.id')
            ->join('tbl_students as s', 'tg.id', '=', 's.group_id')
            ->join('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->where('e.is_adviser_approved', 1)
            ->where('e.is_coordinator_approved', 1)
            ->select(DB::raw("
                def.course,
                def.defense_schedule,
                def.id as defense_matrix_id
            "))
            ->groupBy('e.id', 'def.id', 't.id', 't.title', 'def.defense_schedule', 'f.name_prefix', 'f.first_name', 'f.last_name', 's.section', 'def.course')
            ->get()
            ->map(function ($thesis) {
                $confirmedPanels = DB::table('tbl_endorsed_panels')
                    ->where('defense_matrix_id', $thesis->defense_matrix_id)
                    ->where('is_confirmed', 1)
                    ->count();
                
                $thesis->confirmed_panels_count = $confirmedPanels;
                return $thesis;
            });

        $reportData = [];

        foreach ($months as $monthName => $dates) {
            $courseData = [];

            foreach ($courses as $course) {
                
                $monthlyTheses = $allEndorsedData->filter(function ($item) use ($course, $dates) {
                    if ($item->course !== $course) return false;
                    if (!$item->defense_schedule) return false;
                    $defDate = substr($item->defense_schedule, 0, 10); // Extract YYYY-MM-DD
                    return $defDate >= $dates['start'] && $defDate <= $dates['end'];
                });

                $range = [$dates['start'], $dates['end']];
                
                $earlyStageQuery = DB::table('tbl_theses as t')
                    ->join('tbl_endorsements as e', 't.id', '=', 'e.thesis_id')
                    ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
                    ->where('def.course', $course)
                    ->whereBetween('t.created_at', $range);

                $evaluatedCount = DB::table('tbl_defense_evaluations as eval')
                    ->join('tbl_defense_matrices as def', 'eval.defense_id', '=', 'def.id')
                    ->where('def.course', $course)
                    ->whereBetween('def.defense_schedule', $range)
                    ->count();

                $courseData[] = [
                    'course'    => $course,
                    'groups'    => $monthlyTheses->count(), 
                    'proposals' => (clone $earlyStageQuery)->where('e.id', '>', 0)->count(), 
                    'thesis'    => (clone $earlyStageQuery)->count(), 
                    'endorsed'  => $monthlyTheses->count(), 
                    'scheduled' => $monthlyTheses->count(),
                    'panels'    => $monthlyTheses->sum('confirmed_panels_count'), 
                    'evaluated' => $evaluatedCount,
                ];
            }
            $reportData[$monthName] = $courseData;
        }

        return $reportData;
    }
}