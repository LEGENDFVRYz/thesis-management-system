<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Notifications\AcademicYearAnnounced;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $userId = Auth::id();
        
        $userInfo = DB::table('tbl_faculties')
            ->where('user_id', $userId)
            ->select('name_prefix', 'first_name', 'last_name')
            ->first();

        // Fallback to Username if not found
        if ($userInfo) {
            $fullName = trim("{$userInfo->name_prefix} {$userInfo->first_name} {$userInfo->last_name}");
        } else {
            $fullName = Auth::user()->username ?? 'Admin';
        }

        // 1. Get Active Semester & School Year via SQL Join
        $activeTerm = DB::table('tbl_semesters')
            ->join('tbl_school_years', 'tbl_semesters.school_year_id', '=', 'tbl_school_years.id')
            ->where('tbl_semesters.is_active', true)
            ->select(
                'tbl_semesters.id as semester_id',
                'tbl_semesters.semester',       // 0 = 1st, 1 = 2nd
                'tbl_school_years.year',        // e.g., 2025
                'tbl_school_years.start_date',  // e.g., 2025-08-01
                'tbl_school_years.end_date'     // e.g., 2026-05-30
            )
            ->first();

        // 2. Fallback if no active semester is found (Safety)
        if (!$activeTerm) {
            $activeTerm = (object) [
                'semester' => 0, 
                'year' => date('Y'),
                'display_sy' => date('Y') . '-' . (date('Y') + 1)
            ];
        } else {
            // Create a display string like "2025-2026"
            $activeTerm->display_sy = $activeTerm->year . '-' . ($activeTerm->year + 1);
        }

        
        // 3. Get Date Today
        $dateToday = Carbon::now()->format('F j, Y');
        
        // --- STATS GENERATION ---
        $currentYear = $activeTerm->year;
        $prevYear = $currentYear - 1;
        $targetYears = [$prevYear, $currentYear];
        
        // A. FACULTY (Yearly Breakdown - for charts/trends)
        $facultyYearlyStats = DB::table('tbl_faculty_assignments')
            ->join('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->whereIn('tbl_school_years.year', $targetYears)
            ->select('tbl_school_years.year', DB::raw('count(DISTINCT tbl_faculty_assignments.faculty_id) as count'))
            ->groupBy('tbl_school_years.year')
            ->get();

        // B. FACULTY (Total Unique Active - for the big number card)
        // This ensures a professor assigned to both 2024 and 2025 is counted only ONCE.
        $totalUniqueFaculty = DB::table('tbl_faculty_assignments')
            ->join('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->whereIn('tbl_school_years.year', $targetYears) // Or remove this line to count ALL active faculty ever
            ->where('tbl_faculty_assignments.is_active', true)
            ->distinct('faculty_id')
            ->count('faculty_id');

        // C. STUDENTS (Yearly Breakdown)
        $studentStats = DB::table('tbl_students')
            ->join('tbl_thesis_groups', 'tbl_students.group_id', '=', 'tbl_thesis_groups.id')
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->whereIn('tbl_school_years.year', $targetYears)
            ->select('tbl_school_years.year', DB::raw('count(tbl_students.id) as count'))
            ->groupBy('tbl_school_years.year')
            ->get();

        // D. Format Array for Frontend
        $statistics = [];
        $totalUniqueStudents = 0;

        foreach ($targetYears as $year) {
            $sCount = $studentStats->firstWhere('year', $year)->count ?? 0;
            $fCount = $facultyYearlyStats->firstWhere('year', $year)->count ?? 0;

            $totalUniqueStudents += $sCount; // Summing students (72 + 75)

            $statistics[] = [
                'school_year'   => $year . '-' . ($year + 1),
                'year_start'    => $year,
                'faculty_count' => $fCount,
                'student_count' => $sCount,
            ];
        }

        // dd($statistics);

        // 8. Pass to Frontend
        return Inertia::render('Admin/dashboard', [
            'activeTerm' => $activeTerm,
            'currentDate' => $dateToday,
            'statistics'  => $statistics,
            'totalActiveStudents' => $totalUniqueStudents, 
            'totalActiveFaculty' => $totalUniqueFaculty,
            'userFullName' => $fullName,
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
