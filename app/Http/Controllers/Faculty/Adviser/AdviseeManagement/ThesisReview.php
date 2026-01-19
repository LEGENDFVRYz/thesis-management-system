<?php

namespace App\Http\Controllers\Faculty\Adviser\AdviseeManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ThesisReview extends Controller
{
    /**
     * Display the groups list page.
     */
    public function index()
    {
        $userId = Auth::id();

        // 1. Get the Faculty ID of the logged-in user
        $facultyId = DB::table('tbl_faculties')->where('user_id', $userId)->value('id');

        // 2. Get Active Year (for Year Level calculation)
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? date('Y');

        // 3. Main Query
        $groups = DB::table('tbl_thesis_groups')
            // Link Group to Adviser
            ->join('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->join('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->join('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            
            // Link Group to Thesis Title (via Proposal)
            ->leftJoin('tbl_proposals', function($join) {
                $join->on('tbl_thesis_groups.id', '=', 'tbl_proposals.group_id')
                    ->where('tbl_proposals.is_pursued', true);
            })
            ->leftJoin('tbl_theses', 'tbl_proposals.id', '=', 'tbl_theses.proposal_id')
            
            // Link Group to Students (Proponents)
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')

            // Filter: Only groups handled by THIS adviser
            ->where('tbl_faculty_assignments.faculty_id', $facultyId)
            
            ->select(
                'tbl_thesis_groups.id as group_id',
                'tbl_thesis_groups.group_number',
                'tbl_section_advisers.section',
                
                // Thesis Title
                DB::raw("COALESCE(tbl_theses.title, tbl_proposals.proposal_title, 'No Title Yet') as thesis_title"),

                // Proponents: Group Concat for names
                DB::raw("GROUP_CONCAT(DISTINCT CONCAT(tbl_students.first_name, ' ', tbl_students.last_name) SEPARATOR ', ') as proponents"),
                
                // Number of Proponents
                DB::raw("COUNT(DISTINCT tbl_students.id) as proponent_count"),

                // Year Level Calculation: 3 + (ActiveYear - BatchYear)
                DB::raw("(3 + ($activeYear - tbl_school_years.year)) as year_level"),
                
                // Group Code
                DB::raw("
                    CONCAT(
                        (3 + ($activeYear - tbl_school_years.year)), 
                        tbl_section_advisers.section, 
                        LPAD(tbl_thesis_groups.group_number, 2, '0')
                    ) AS group_code
                ")
            )
            ->groupBy(
                'tbl_thesis_groups.id',
                'tbl_thesis_groups.group_number',
                'tbl_section_advisers.section',
                'tbl_theses.title',
                'tbl_proposals.proposal_title',
                'tbl_school_years.year'
            )
            ->orderBy('year_level')
            ->orderBy('tbl_thesis_groups.group_number')
            ->get();

        // dd($groups);

        return Inertia::render('Faculty/management/adviser/advisee_management/thesis_review/index', [
            'groups' => $groups
        ]);
    }

    /**
     * Display the submissions list page for a specific group.
     */
    public function submissions($groupCode)
    {
        return Inertia::render('Faculty/management/adviser/advisee_management/thesis_review/submissions', [
            'groupCode' => $groupCode,
        ]);
    }

    /**
     * Display the document review page.
     */
    public function review($groupCode, $submissionId)
    {
        return Inertia::render('Faculty/management/adviser/advisee_management/thesis_review/review', [
            'groupCode' => $groupCode,
            'submissionId' => $submissionId,
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