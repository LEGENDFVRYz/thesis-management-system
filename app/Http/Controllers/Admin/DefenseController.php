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

    // public function index()
    // {
    //     // 1. Get Active Year logic
    //     $activeYear = DB::table('tbl_school_years')
    //         ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
    //         ->where('tbl_semesters.is_active', true)
    //         ->value('year');

    //     $activeYear = $activeYear ?? 2025;

    //     $defenses = DB::table('tbl_defense_matrices')
    //         // --- EXISTING JOINS (For Thesis, Group, Adviser) ---
    //         ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
    //         ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
    //         ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
    //         ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
    //         ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
    //         ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
    //         ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
    //         ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            
    //         // --- JOIN STUDENTS ---
    //         ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')

    //         // --- JOINS PANELISTS ---
    //         // 1. Link Matrix to Endorsed Panels (Confirmed Only)
    //         ->leftJoin('tbl_endorsed_panels', function($join) {
    //             $join->on('tbl_defense_matrices.id', '=', 'tbl_endorsed_panels.defense_matrix_id')
    //                  ->where('tbl_endorsed_panels.is_confirmed', true);
    //         })
    //         // 2. Link Panel to their Faculty Assignment (Alias: panel_assign)
    //         ->leftJoin('tbl_faculty_assignments as panel_assign', 'tbl_endorsed_panels.panel_id', '=', 'panel_assign.id')
    //         // 3. Link Assignment to Faculty Details (Alias: panel_faculty)
    //         ->leftJoin('tbl_faculties as panel_faculty', 'panel_assign.faculty_id', '=', 'panel_faculty.id')

    //         ->select(
    //             'tbl_defense_matrices.id as id',

    //             // Group Code Logic
    //             DB::raw("
    //                 CONCAT(
    //                     (3 + ($activeYear - tbl_school_years.year)), 
    //                     tbl_section_advisers.section, 
    //                     LPAD(tbl_thesis_groups.group_number, 2, '0')
    //                 ) AS group_code
    //             "),

    //             DB::raw("(3 + ($activeYear - tbl_school_years.year)) as year_level"),
    //             'tbl_theses.title as thesis_title',
    //             'tbl_section_advisers.section as block',
    //             'tbl_defense_matrices.defense_room',

    //             // Adviser Name
    //             DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as adviser_name"),

    //             // Date Formatting
    //             DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%M %e, %Y') as defense_date"), // e.g., "December 28, 2025"
    //             DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%l:%i %p') as defense_time"),   // e.g., "1:00 PM"
    //             DB::raw("CONCAT(tbl_defense_matrices.course, ' Defense') as defense_type"),

    //             // --- NEW COLUMNS ---
                
    //             // 1. Proponent Count
    //             DB::raw("COUNT(DISTINCT tbl_students.id) as proponents_count"),

    //             // 2. List of Proponents
    //             // DISTINCT is used to avoid duplicates caused by the join with panelists
    //             DB::raw("GROUP_CONCAT(DISTINCT CONCAT(tbl_students.first_name, ' ', tbl_students.last_name) SEPARATOR ', ') as proponent_names"),

    //             // 3. List of Panelists
    //             DB::raw("GROUP_CONCAT(DISTINCT CONCAT(panel_faculty.name_prefix, ' ', panel_faculty.first_name, ' ', panel_faculty.last_name) SEPARATOR ', ') as panelist_names")
    //         )
    //         ->groupBy(
    //             'tbl_defense_matrices.id',
    //             'tbl_school_years.year',
    //             'tbl_section_advisers.section',
    //             'tbl_thesis_groups.group_number',
    //             'tbl_theses.title',
    //             'tbl_faculties.name_prefix',
    //             'tbl_faculties.first_name',
    //             'tbl_faculties.last_name',
    //             'tbl_defense_matrices.defense_schedule',
    //             'tbl_defense_matrices.course',
    //             'tbl_defense_matrices.defense_room'
    //         )
    //         ->orderBy('tbl_defense_matrices.defense_schedule', 'asc')
    //         ->get();

    //     // dd($defenses);

    //     return Inertia::render('Admin/management/defense', [
    //         'defenses' => $defenses,
    //         'activeYear' => $activeYear
    //     ]);
    // }

    public function index(Request $request)
    {
        // 1. Get Active Year (Same as before)
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year');

        $activeYear = $activeYear ?? 2025;

        // 2. GET DROPDOWN OPTIONS (Distinct lists for the filters)
        
        // List of unique Advisers assigned to sections
        $advisers = DB::table('tbl_section_advisers')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            ->select(
                'tbl_faculties.id', // Use ID for value
                DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as name")
            )
            ->distinct()
            ->get();

        // List of unique Blocks/Sections
        $blocks = DB::table('tbl_section_advisers')
            ->select('section')
            ->distinct()
            ->orderBy('section')
            ->pluck('section'); // Returns simple array: ['1', '2', '3']


        // 3. MAIN QUERY WITH FILTERS
        $query = DB::table('tbl_defense_matrices')
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')
            
            // --- NEW PANEL JOINS ---
            ->leftJoin('tbl_endorsed_panels', function($join) {
                $join->on('tbl_defense_matrices.id', '=', 'tbl_endorsed_panels.defense_matrix_id')
                    ->where('tbl_endorsed_panels.is_confirmed', true);
            })
            ->leftJoin('tbl_faculty_assignments as panel_assign', 'tbl_endorsed_panels.panel_id', '=', 'panel_assign.id')
            ->leftJoin('tbl_faculties as panel_faculty', 'panel_assign.faculty_id', '=', 'panel_faculty.id');

        // --- APPLY FILTERS ---
        
        // A. Search by Title
        $query->when($request->search, function($q, $search) {
            $q->where('tbl_theses.title', 'like', "%{$search}%");
        });

        // B. Filter by Adviser (using ID)
        $query->when($request->adviser, function($q, $adviserId) {
            $q->where('tbl_faculties.id', $adviserId);
        });

        // C. Filter by Block
        $query->when($request->block, function($q, $block) {
            $q->where('tbl_section_advisers.section', $block);
        });

        // --- SELECT & EXECUTE ---
        $defenses = $query->select(
                'tbl_defense_matrices.id as id',
                'tbl_defense_matrices.defense_room',
                DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%M %e, %Y') as defense_date"),
                DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%l:%i %p') as defense_time"),
                
                DB::raw("
                    CONCAT(
                        (3 + ($activeYear - tbl_school_years.year)), 
                        tbl_section_advisers.section, 
                        LPAD(tbl_thesis_groups.group_number, 2, '0')
                    ) AS group_code
                "),

                DB::raw("(3 + ($activeYear - tbl_school_years.year)) as year_level"),
                'tbl_theses.title as thesis_title',
                'tbl_section_advisers.section as block',
                DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as adviser_name"),
                DB::raw("CONCAT(tbl_defense_matrices.course, ' Defense') as defense_type"),
                DB::raw("COUNT(DISTINCT tbl_students.id) as proponents_count"),
                DB::raw("GROUP_CONCAT(DISTINCT CONCAT(tbl_students.first_name, ' ', tbl_students.last_name) SEPARATOR ', ') as proponent_names"),
                DB::raw("GROUP_CONCAT(DISTINCT CONCAT(panel_faculty.name_prefix, ' ', panel_faculty.first_name, ' ', panel_faculty.last_name) SEPARATOR ', ') as panelist_names")
            )
            ->groupBy(
                'tbl_defense_matrices.id',
                'tbl_defense_matrices.defense_room',
                'tbl_school_years.year',
                'tbl_section_advisers.section',
                'tbl_thesis_groups.group_number',
                'tbl_theses.title',
                'tbl_faculties.name_prefix',
                'tbl_faculties.first_name',
                'tbl_faculties.last_name',
                'tbl_defense_matrices.defense_schedule',
                'tbl_defense_matrices.course',
                'tbl_faculties.id' // Added for proper grouping with Adviser Filter
            )
            ->orderBy('tbl_defense_matrices.defense_schedule', 'asc')
            ->get();

        return Inertia::render('Admin/management/defense', [
            'defenses' => $defenses,
            'activeYear' => $activeYear,
            
            // Pass options and current filters to frontend
            'adviserOptions' => $advisers,
            'blockOptions' => $blocks,
            'filters' => $request->only(['search', 'adviser', 'block']),
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
