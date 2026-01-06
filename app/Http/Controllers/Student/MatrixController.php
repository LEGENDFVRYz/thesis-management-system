<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MatrixController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        // 1. Get Logged-in Student's Section AND Batch (School Year)
        // We join tables to find out which School Year the student's group belongs to.
        $student = DB::table('tbl_students')
            ->join('tbl_thesis_groups', 'tbl_students.group_id', '=', 'tbl_thesis_groups.id')
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->where('tbl_students.user_id', $userId)
            ->select(
                'tbl_section_advisers.section',
                'tbl_faculty_assignments.sy_id',
                'tbl_school_years.year as batch_year'
            )
            ->first();

        if (!$student) {
            abort(403, 'Student record or Thesis Group not found.');
        }

        // 2. Get Active Year (Keep this for your Group Code calculation)
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? date('Y');

        $yearLevel = 3 + ($activeYear - $student->batch_year);

        // 3. Fetch Defense Schedules
        $schedules = DB::table('tbl_defense_matrices')
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            
            // Adviser Details
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_faculties as adviser', 'tbl_faculty_assignments.faculty_id', '=', 'adviser.id')
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            
            // Group Members
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')

            // Panelists
            ->leftJoin('tbl_endorsed_panels', function($join) {
                $join->on('tbl_defense_matrices.id', '=', 'tbl_endorsed_panels.defense_matrix_id')
                     ->where('tbl_endorsed_panels.is_confirmed', true);
            })
            ->leftJoin('tbl_faculty_assignments as panel_assign', 'tbl_endorsed_panels.panel_id', '=', 'panel_assign.id')
            ->leftJoin('tbl_faculties as panel_faculty', 'panel_assign.faculty_id', '=', 'panel_faculty.id')

            // --- FILTERS ---
            ->where('tbl_section_advisers.section', $student->section) // Filter by Section
            ->where('tbl_faculty_assignments.sy_id', $student->sy_id)  // <--- NEW: Filter by Batch/School Year
            
            ->select(
                'tbl_defense_matrices.id as defense_matrix_id',
                'tbl_thesis_groups.group_number',
                'tbl_section_advisers.section',
                'tbl_theses.title as thesis_title',
                DB::raw("(3 + ($activeYear - tbl_school_years.year)) as year_level"),
                DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%M %e, %Y') as defense_date"),
                DB::raw("CONCAT(
                    DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%l:%i %p'), 
                    ' - ', 
                    DATE_FORMAT(DATE_ADD(tbl_defense_matrices.defense_schedule, INTERVAL 1 HOUR), '%l:%i %p')
                ) as defense_time_range"),
                DB::raw("
                    CONCAT(
                        (3 + ($activeYear - tbl_school_years.year)), 
                        tbl_section_advisers.section, 
                        LPAD(tbl_thesis_groups.group_number, 2, '0')
                    ) AS group_code
                "),
                DB::raw("CONCAT(adviser.name_prefix, ' ', adviser.first_name, ' ', adviser.last_name) as adviser_name"),
                DB::raw("GROUP_CONCAT(DISTINCT CONCAT(tbl_students.first_name, ' ', tbl_students.last_name) SEPARATOR ', ') as members"),
                DB::raw("GROUP_CONCAT(DISTINCT CONCAT(panel_faculty.name_prefix, ' ', panel_faculty.first_name, ' ', panel_faculty.last_name) SEPARATOR ', ') as panelists")
            )
            ->groupBy(
                'tbl_defense_matrices.id',
                'tbl_defense_matrices.defense_schedule',
                'tbl_thesis_groups.group_number',
                'tbl_section_advisers.section',
                'tbl_theses.title',
                'tbl_school_years.year',
                'adviser.name_prefix',
                'adviser.first_name',
                'adviser.last_name'
            )
            ->orderBy('tbl_defense_matrices.defense_schedule', 'asc')
            ->get();

        // dd($student);

        return Inertia::render('Student/management/defense_matrix', [
            'schedules' => $schedules,
            'mySection' => $student->section,
            'yearLevel' => $yearLevel,
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
