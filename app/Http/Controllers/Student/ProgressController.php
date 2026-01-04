<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProgressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function statusReports()
    {
        $userId = Auth::id();

        // 1. Get the Logged-in Student's Group ID
        $student = DB::table('tbl_students')
            ->where('user_id', $userId)
            ->select('group_id')
            ->first();

        if (!$student || !$student->group_id) {
            return Inertia::render('Student/management/progress_tracking/status_reports', [
                'groupedComments' => []
            ]);
        }

        // 2. Fetch All Evaluations for this Group
        $evaluations = DB::table('tbl_defense_evaluations')
            ->join('tbl_defense_matrices', 'tbl_defense_evaluations.defense_id', '=', 'tbl_defense_matrices.id')
            ->join('tbl_endorsements', 'tbl_defense_matrices.endorsement_id', '=', 'tbl_endorsements.id')
            ->join('tbl_theses', 'tbl_endorsements.thesis_id', '=', 'tbl_theses.id')
            ->join('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            
            // Join to get Evaluator Details & Role
            ->join('tbl_faculty_assignments', 'tbl_defense_evaluations.evaluator_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            ->join('tbl_faculty_roles', 'tbl_faculty_assignments.role_id', '=', 'tbl_faculty_roles.id')

            // Filter by the Student's Group
            ->where('tbl_proposals.group_id', $student->group_id)

            ->select(
                'tbl_defense_matrices.course', // Grouping Key (MOR, DP1, DP2)
                'tbl_defense_evaluations.id',
                'tbl_defense_evaluations.comment',
                'tbl_faculties.id as faculty_id', // Needed for the badge (P1, P2)
                DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as evaluator_name"),
                'tbl_faculty_roles.role_name' // To identify 'Adviser' vs 'Panelist'
            )
            ->orderBy('tbl_defense_evaluations.created_at', 'desc')
            ->get();

            
        // 3. Group by Course
        $groupedEvaluations = $evaluations->groupBy('course');

        // dd($groupedEvaluations);

        return Inertia::render('Student/management/progress_tracking/status_reports', [
            'groupedComments' => $groupedEvaluations
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
