<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DefenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get the year (e.g., 2025) from the active semester
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year');

        // Fallback if no active year is set (optional safety)
        $activeYear = $activeYear ?? 2025;

        $defenses = DB::table('tbl_defense_matrices')
            // 1. Join Tables to reach Group and Faculty
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            
            // 2. Join Students (Left Join ensures we still see the group even if empty)
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')

            ->select(
                // --- Group Code Logic ---
                DB::raw("
                    CONCAT(
                        (3 + ($activeYear - tbl_school_years.year)), 
                        tbl_section_advisers.section, 
                        LPAD(tbl_thesis_groups.group_number, 2, '0')
                    ) AS group_code
                "),

                DB::raw("(3 + ($activeYear - tbl_school_years.year)) as year_level"),

                'tbl_theses.title as thesis_title',
                
                // --- Proponent Count ---
                DB::raw("COUNT(tbl_students.id) as proponents"),

                // --- Adviser Name ---
                DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as adviser_name"),
                
                'tbl_section_advisers.section as block',

                // --- Date Formatting (Month Day, Year 12:00 PM) ---
                DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%M %e, %Y %l:%i %p') as defense_date_time"),

                // --- Defense Type ---
                DB::raw("CONCAT(tbl_defense_matrices.course, ' Defense') as defense_type")
            )
            // Group By is mandatory when using COUNT() alongside other columns
            ->groupBy(
                'tbl_defense_matrices.id',
                'tbl_school_years.year',
                'tbl_section_advisers.section',
                'tbl_thesis_groups.group_number',
                'tbl_theses.title',
                'tbl_faculties.name_prefix',
                'tbl_faculties.first_name',
                'tbl_faculties.last_name',
                'tbl_defense_matrices.defense_schedule',
                'tbl_defense_matrices.course'
            )
            ->orderBy('tbl_defense_matrices.defense_schedule', 'asc')
            ->get();

        return Inertia::render('Admin/management/defense', [
            'defenses' => $defenses,
            'activeYear' => $activeYear
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
