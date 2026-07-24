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

    public function index(Request $request)
    {
        // Get Active Year
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year');

        $activeYear = $activeYear ?? 2025;

        // GET DROPDOWN OPTIONS (Distinct lists for the filters)
        
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
            ->pluck('section');

        // MAIN QUERY WITH FILTERS
        $query = DB::table('tbl_defense_matrices')
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id');   

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

                'tbl_defense_matrices.id as id',            // Defense ID
                'tbl_defense_matrices.defense_room',        // Defense Room
                'tbl_theses.title as thesis_title',         // Thesis Title
                'tbl_section_advisers.section as block',    // Block/Section
                
                // Group Code Logic
                DB::raw("
                    CONCAT(
                        (3 + ($activeYear - tbl_school_years.year)), 
                        tbl_section_advisers.section, 
                        LPAD(tbl_thesis_groups.group_number, 2, '0')
                    ) AS group_code
                "),
                
                // Schedule
                DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%M %e, %Y') as defense_date"),
                DB::raw("DATE_FORMAT(tbl_defense_matrices.defense_schedule, '%l:%i %p') as defense_time"),
                DB::raw("CONCAT(tbl_defense_matrices.course, ' Defense') as defense_type"),
                
                // Year Level
                DB::raw("(3 + ($activeYear - tbl_school_years.year)) as year_level"),

                // Adviser Name
                DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as adviser_name"),

                // Proponent Count
                DB::raw("COUNT(DISTINCT tbl_students.id) as proponents_count"),

                // Proponents
                DB::raw("GROUP_CONCAT(DISTINCT CONCAT(tbl_students.first_name, ' ', tbl_students.last_name) SEPARATOR ', ') as proponent_names"),

                // Status
                DB::raw("
                    CASE 
                        WHEN tbl_defense_matrices.defense_schedule < NOW() 
                            AND (SELECT COUNT(*) FROM tbl_defense_evaluations WHERE tbl_defense_evaluations.defense_id = tbl_defense_matrices.id) >= 3
                        THEN 'completed'
                        ELSE 'upcoming'
                    END as status
                ")
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
                'tbl_faculties.id',
            )
            ->orderBy('tbl_defense_matrices.defense_schedule', 'asc')
            ->get();

        // FETCH PANELS SEPARATELY
        $defenseIds = $defenses->pluck('id')->toArray();

        if (!empty($defenseIds)) {
            $panels = DB::table('tbl_endorsed_panels')
                ->join('tbl_faculty_assignments', 'tbl_endorsed_panels.panel_id', '=', 'tbl_faculty_assignments.id')
                ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
                ->whereIn('tbl_endorsed_panels.defense_matrix_id', $defenseIds)
                ->where('tbl_endorsed_panels.is_confirmed', true)
                ->select(
                    'tbl_endorsed_panels.defense_matrix_id',
                    'tbl_faculties.id as faculty_id',
                    'tbl_faculties.name_prefix',
                    'tbl_faculties.first_name',
                    'tbl_faculties.last_name'
                )
                ->get();

            // MERGE PANELS INTO DEFENSES
            $defenses->transform(function ($defense) use ($panels) {
                $defense->panelists = $panels
                    ->where('defense_matrix_id', $defense->id)
                    ->map(function ($panel) {
                        $cleanPanel = clone $panel; 
                        unset($cleanPanel->defense_matrix_id); 
                        return $cleanPanel;
                    })
                    ->values();
                return $defense;
            });
        } else {
            $defenses->transform(function ($defense) {
                $defense->panelists = [];
                return $defense;
            });
        }

        return Inertia::render('Admin/management/defense', [
            'defenses' => $defenses,
            'activeYear' => $activeYear,
            'adviserOptions' => $advisers,
            'blockOptions' => $blocks,
            'filters' => $request->only(['search', 'adviser', 'block']),
        ]);
    }

}
