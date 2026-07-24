<?php

namespace App\Http\Controllers\Faculty\Adviser;

use App\Http\Controllers\Controller;
use App\Models\DefenseEvaluation;
use App\Models\FacultyRole;
use App\Models\RubricScore;
use App\Models\Semester;
use Database\Seeders\FacultyRoleSeeder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EvaluationGrading extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 0.01: Kuru

        // 1. Get Logged-in User ID
        $userId = Auth::id();

        // 2. Get Active Year (Optional: To calculate Year Level correctly)
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? 2025;

        // 3. Main Query
        $myAdvisories = DB::table('tbl_defense_matrices')
            // A. Join backwards to reach the Group
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            
            // B. Join to reach the Adviser (Logged In User)
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            
            // C. Join for extra details (School Year for batch calculation, Students)
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')

            // D. Join to reach the ACTUAL EVALUATORS (Who sat/graded)
            // Logic: Defense -> Evaluation -> Assignment -> Faculty
            ->leftJoin('tbl_defense_evaluations', 'tbl_defense_matrices.id', '=', 'tbl_defense_evaluations.defense_id')
            ->leftJoin('tbl_faculty_assignments as panel_assign', 'tbl_defense_evaluations.evaluator_id', '=', 'panel_assign.id')
            ->leftJoin('tbl_faculties as panel_faculty', 'panel_assign.faculty_id', '=', 'panel_faculty.id')

            // --- CRITICAL FILTERS ---
            // 1. Filter by the currently logged-in user
            ->where('tbl_faculties.user_id', $userId)
            
            // 2. Ensure we are looking at their 'Adviser' role (id 2 based on your previous seeds)
            // Or perform a join to tbl_faculty_roles to be safe:
            ->join('tbl_faculty_roles', 'tbl_faculty_assignments.role_id', '=', 'tbl_faculty_roles.id')
            ->where('tbl_faculty_roles.role_name', 'Adviser')

            // --- SELECT & EXECUTE ---
            ->select(

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

                // Panel Reviews (JSON AGGREGATION)
                DB::raw("
                    CONCAT('[', 
                        GROUP_CONCAT(DISTINCT 
                            JSON_OBJECT(
                                'name', CONCAT(panel_faculty.name_prefix, ' ', panel_faculty.first_name, ' ', panel_faculty.last_name),
                                'grade', tbl_defense_evaluations.grade,
                                'comment', tbl_defense_evaluations.comment,
                                'remarks', tbl_defense_evaluations.remarks
                            )
                        ), 
                    ']') as panel_reviews
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
                'tbl_faculties.id'
            )
            ->orderBy('tbl_defense_matrices.defense_schedule', 'asc')
            ->get();

        return Inertia::render('Faculty/management/adviser/evaluation_grading/eval_n_grading', [
            'myAdvisories' => $myAdvisories
        ]);
    }

    public function showDocumentReview($id)
    {
        // 1. Get Logged-in User (For security check)
        $userId = Auth::id();

        // 2. Get Active Year (Needed for Year Level & Group Code calculation)
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? 2025;

        // 3. Single Record Query
        $advisory = DB::table('tbl_defense_matrices')
            // --- A. Join backwards to reach the Group ---
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            
            // --- B. Join to reach the Adviser (Logged In User) ---
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            
            // --- C. Join for extra details ---
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')

            // --- D. Join to reach the ACTUAL EVALUATORS ---
            ->leftJoin('tbl_defense_evaluations', 'tbl_defense_matrices.id', '=', 'tbl_defense_evaluations.defense_id')
            ->leftJoin('tbl_faculty_assignments as panel_assign', 'tbl_defense_evaluations.evaluator_id', '=', 'panel_assign.id')
            ->leftJoin('tbl_faculties as panel_faculty', 'panel_assign.faculty_id', '=', 'panel_faculty.id')

            // --- FILTERS ---
            ->where('tbl_defense_matrices.id', $id) // Filter by the specific Defense ID
            ->where('tbl_faculties.user_id', $userId) // Security: Ensure logged-in user is the adviser
            
            // --- SELECTS ---
            ->select(
                'tbl_defense_matrices.id as id',
                'tbl_defense_matrices.defense_room',
                'tbl_theses.title as thesis_title',
                'tbl_section_advisers.section as block',
                
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

                // Panel Reviews (JSON AGGREGATION)
                DB::raw("
                    CONCAT('[', 
                        GROUP_CONCAT(DISTINCT 
                            JSON_OBJECT(
                                'name', CONCAT(panel_faculty.name_prefix, ' ', panel_faculty.first_name, ' ', panel_faculty.last_name),
                                'grade', tbl_defense_evaluations.grade,
                                'comment', tbl_defense_evaluations.comment,
                                'remarks', tbl_defense_evaluations.remarks
                            )
                        ), 
                    ']') as panel_reviews
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
                'tbl_faculties.id'
            )
            ->first();

        return Inertia::render('Faculty/management/adviser/evaluation_grading/document_review', [
            'advisory' => $advisory,
            'id' => $id
        ]);
    }

    public function showEvaluation($id)
    {
        // 1. Get Logged-in User (For security check)
        $userId = Auth::id();

        // 2. Get Active Year (Needed for Year Level & Group Code calculation)
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? 2025;

        // 3. Single Record Query
        $advisory = DB::table('tbl_defense_matrices')
            // --- A. Join backwards to reach the Group ---
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            ->join('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            
            // --- B. Join to reach the Adviser (Logged In User) ---
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            
            // --- C. Join for extra details ---
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')

            // --- D. Join to reach the ACTUAL EVALUATORS ---
            ->leftJoin('tbl_defense_evaluations', 'tbl_defense_matrices.id', '=', 'tbl_defense_evaluations.defense_id')
            ->leftJoin('tbl_faculty_assignments as panel_assign', 'tbl_defense_evaluations.evaluator_id', '=', 'panel_assign.id')
            ->leftJoin('tbl_faculties as panel_faculty', 'panel_assign.faculty_id', '=', 'panel_faculty.id')

            // --- FILTERS ---
            ->where('tbl_defense_matrices.id', $id) // Filter by the specific Defense ID
            ->where('tbl_faculties.user_id', $userId) // Security: Ensure logged-in user is the adviser
            
            // --- SELECTS ---
            ->select(
                'tbl_defense_matrices.id as id',
                'tbl_defense_matrices.defense_room',
                'tbl_theses.title as thesis_title',
                'tbl_section_advisers.section as block',
                
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

                // Panel Reviews (JSON AGGREGATION)
                DB::raw("
                    CONCAT('[', 
                        GROUP_CONCAT(DISTINCT 
                            JSON_OBJECT(
                                'name', CONCAT(panel_faculty.name_prefix, ' ', panel_faculty.first_name, ' ', panel_faculty.last_name),
                                'grade', tbl_defense_evaluations.grade,
                                'comment', tbl_defense_evaluations.comment,
                                'remarks', tbl_defense_evaluations.remarks
                            )
                        ), 
                    ']') as panel_reviews
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
                'tbl_faculties.id'
            )
            ->first();

        // Peer Evaluations
        $peerEvaluations = DB::table('tbl_defense_evaluations')
            ->join('tbl_faculty_assignments', 'tbl_defense_evaluations.evaluator_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            ->where('tbl_defense_evaluations.defense_id', $id)
            ->where('tbl_faculties.user_id', '!=', $userId) // Exclude adviser's own evaluation
            ->select(
                'tbl_defense_evaluations.id',
                'tbl_defense_evaluations.grade',
                'tbl_defense_evaluations.remarks',
                'tbl_defense_evaluations.comment',
                'tbl_faculties.first_name',
                'tbl_faculties.last_name',
                'tbl_faculties.name_prefix'
            )
            ->get();

        $rubricStructure = \App\Models\GradingCriteria::with(['rubrics.levels' => function($query) {
                $query->orderBy('levels', 'asc');
            }])
            ->get();

        return Inertia::render('Faculty/management/adviser/evaluation_grading/evaluation', [
            'advisory' => $advisory,
            'id' => $id,
            'rubrics'  => $rubricStructure,
            'peerEvaluations' => $peerEvaluations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate Input
        $request->validate([
            'defense_id' => 'required|exists:tbl_defense_matrices,id',
            'grade'      => 'required|numeric|min:0|max:100',
            'remarks'    => 'required|string',
            'comment'    => 'nullable|string',
            'ratings'    => 'required|array',
        ]);

        $userId = Auth::id();
        $adviserRoleId = FacultyRole::where('role_name', 'Adviser')->value('id');
        $activeSemester = Semester::where('is_active', true)->first();
        $syId = $activeSemester ? $activeSemester->school_year_id : null;

        // Determine the correct Evaluator ID (Assignment ID)
        // We need to find the faculty_assignment ID for the logged-in user corresponding to their panel role
        $evaluatorAssignment = DB::table('tbl_faculty_assignments')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            ->where('tbl_faculties.user_id', $userId)
            ->where('tbl_faculty_assignments.role_id', $adviserRoleId)
            ->where('tbl_faculty_assignments.sy_id', $syId)            
            ->select('tbl_faculty_assignments.id')
            ->first();

        if (!$evaluatorAssignment) {
            return back()->withErrors(['error' => 'Evaluator assignment record not found for this user.']);
        }

        DB::transaction(function () use ($request, $evaluatorAssignment) {
            
            // Create/Update the Main Evaluation Header
            // Use updateOrCreate to prevent duplicate submissions from the same person for the same defense
            $evaluation = DefenseEvaluation::updateOrCreate(
                [
                    'defense_id'   => $request->defense_id,
                    'evaluator_id' => $evaluatorAssignment->id,
                ],
                [
                    'grade'      => $request->grade,
                    'remarks'    => $request->remarks,
                    'comment'    => $request->comment,
                    'updated_at' => now(),
                ]
            );

            // Save Rubric Scores
            // First, remove old scores if they are re-submitting (clean slate)
            RubricScore::where('evaluation_id', $evaluation->id)->delete();

            $scoresToInsert = [];
            foreach ($request->ratings as $rubricId => $rating) {
                $scoresToInsert[] = [
                    'evaluation_id' => $evaluation->id,
                    'rubric_id'     => $rubricId,
                    'rating'        => $rating,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];
            }

            if (!empty($scoresToInsert)) {
                RubricScore::insert($scoresToInsert);
            }
        });

        // Redirect back to the main table or show success
        return redirect()->route('faculty.management.adviser.eval_n_grading')
            ->with('success', 'Evaluation submitted successfully.');
    }
}
