<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        // 1. Get Logged-in Student and their Group ID
        $student = DB::table('tbl_students')
            ->where('user_id', $userId)
            ->select('id', 'group_id', 'section')
            ->first();

        if (!$student || !$student->group_id) {
            return Inertia::render('Student/management/eval_n_grading', ['hasRecord' => false]);
        }

        // 2. Find the LATEST Defense Matrix for this Group
        // We join tables to reach the group, then order by schedule to get the latest stage (MOR -> DP1 -> DP2)
        $latestDefense = DB::table('tbl_defense_matrices')
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->where('tbl_proposals.group_id', $student->group_id)
            ->orderBy('tbl_defense_matrices.defense_schedule', 'desc') // Get the latest date
            ->select('tbl_defense_matrices.id')
            ->first();

        if (!$latestDefense) {
            return Inertia::render('Student/management/eval_n_grading', ['hasRecord' => false]);
        }

        $defenseId = $latestDefense->id;

        // 3. Get Active Year (Visuals)
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? 2025;

        // 4. Fetch Defense Details (Metadata)
        $defenseDetails = DB::table('tbl_defense_matrices')
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            
            // Join Adviser Details to identify who is the adviser later
            ->join('tbl_faculty_assignments as adviser_assign', 'tbl_section_advisers.faculty_assign_id', '=', 'adviser_assign.id')
            ->join('tbl_faculties as adviser_profile', 'adviser_assign.faculty_id', '=', 'adviser_profile.id')

            ->where('tbl_defense_matrices.id', $defenseId)
            ->select(
                'tbl_defense_matrices.id',
                'tbl_theses.title as thesis_title',
                'tbl_defense_matrices.course',
                DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%M %e, %Y') as defense_date"),
                
                // We need the Adviser's Assignment ID to distinguish grades
                'adviser_assign.id as adviser_assignment_id',
                DB::raw("CONCAT(adviser_profile.name_prefix, ' ', adviser_profile.first_name, ' ', adviser_profile.last_name) as adviser_name")
            )
            ->first();

        // 5. Fetch ALL Evaluations (Grades & Comments)
        $evaluations = DB::table('tbl_defense_evaluations')
            ->join('tbl_faculty_assignments', 'tbl_defense_evaluations.evaluator_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            ->where('tbl_defense_evaluations.defense_id', $defenseId)
            ->select(
                'tbl_defense_evaluations.id',
                'tbl_defense_evaluations.evaluator_id',
                'tbl_defense_evaluations.grade',
                'tbl_defense_evaluations.remarks',
                'tbl_defense_evaluations.comment',
                'tbl_faculties.first_name',
                'tbl_faculties.last_name',
                'tbl_faculties.name_prefix',
                'tbl_faculties.id as faculty_id' // For UI Badges (P1, P2)
            )
            ->get();

        // 6. Compute Weighted Grade
        // Formula: (Adviser * 40%) + (Average of Panels * 60%)
        
        $adviserGrade = 0;
        $panelGrades = [];
        $hasAdviserGraded = false;

        $formattedEvaluations = $evaluations->map(function ($eval) use ($defenseDetails, &$adviserGrade, &$panelGrades, &$hasAdviserGraded) {
            $isAdviser = $eval->evaluator_id === $defenseDetails->adviser_assignment_id;

            if ($isAdviser) {
                $adviserGrade = $eval->grade;
                $hasAdviserGraded = true;
            } else {
                $panelGrades[] = $eval->grade;
            }

            return [
                'id' => $eval->id,
                'name' => "{$eval->name_prefix} {$eval->first_name} {$eval->last_name}",
                'role' => $isAdviser ? 'Adviser' : 'Panelist',
                'grade' => $eval->grade,
                'remarks' => $eval->remarks,
                'comment' => $eval->comment,
                'faculty_id' => $eval->faculty_id
            ];
        });

        $panelAverage = count($panelGrades) > 0 ? array_sum($panelGrades) / count($panelGrades) : 0;
        
        // Final Computation
        // If adviser hasn't graded, we can't compute full grade yet, but showing partial data is better than nothing.
        $finalGrade = ($adviserGrade * 0.40) + ($panelAverage * 0.60);

        // dd($adviserGrade);   

        return Inertia::render('Student/management/eval_n_grading', [
            'hasRecord' => true,
            'details' => [
                'title' => $defenseDetails->thesis_title,
                'course' => $defenseDetails->course, // MOR, DP1, DP2
                'date' => $defenseDetails->defense_date,
                'adviser_name' => $defenseDetails->adviser_name,
            ],
            'evaluations' => $formattedEvaluations,
            'grades' => [
                'adviser_score' => number_format($adviserGrade, 2),
                'panel_average' => number_format($panelAverage, 2),
                'final_grade' => number_format($finalGrade, 2),
                'panel_count' => count($panelGrades),
                'has_adviser_graded' => $hasAdviserGraded
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
