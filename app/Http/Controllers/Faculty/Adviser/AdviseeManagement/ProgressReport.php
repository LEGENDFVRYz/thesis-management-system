<?php

namespace App\Http\Controllers\Faculty\Adviser\AdviseeManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProgressReport extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {$UserID = Auth::id();

        $groups = DB::table('tbl_thesis_groups as tg')
            ->leftJoin('tbl_proposals as p', 'tg.id', '=', 'p.group_id')
            ->leftJoin('tbl_theses as th', 'p.id', '=', 'th.proposal_id')
            ->leftJoin('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->leftJoin('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->leftJoin('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->leftJoin('users as u', 'f.user_id', '=', 'u.id')
            ->leftJoin('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')

            ->where('fa.faculty_id', $UserID)

            ->select([
                'tg.id as group_id',
                'tg.group_number',

                DB::raw("CONCAT('BSCPE ', 3 - (sy.year - 2025), '-', sa.section) AS block"),

                DB::raw("CONCAT(3 - (sy.year - 2025), sa.section, LPAD(tg.group_number, 2, '0')) AS group_code"),

                DB::raw("MAX(p.proposal_title) AS proposal_title"),

                DB::raw("(
                    SELECT COUNT(*)
                    FROM tbl_students
                    WHERE tbl_students.group_id = tg.id
                ) AS proponents_count"),

                DB::raw("
                    CASE
                        WHEN MAX(p.id) IS NULL THEN 'No Proposal'
                        WHEN MAX(p.is_pursued) = 0 THEN 'Proposal Pending'
                        WHEN MAX(p.is_pursued) = 1 AND MAX(th.id) IS NULL THEN 'Proposal Approved'
                        WHEN MAX(th.id) IS NOT NULL AND MAX(th.manuscript_filepath) IS NULL THEN 'Thesis Draft'
                        WHEN MAX(th.manuscript_filepath) IS NOT NULL THEN 'Thesis Manuscript'
                        ELSE 'Unknown'
                    END AS thesis_stage,

                    CASE
                        WHEN MAX(p.id) IS NULL THEN 0
                        WHEN MAX(p.is_pursued) = 0 THEN 10
                        WHEN MAX(p.is_pursued) = 1 AND MAX(th.id) IS NULL THEN 40
                        WHEN MAX(th.id) IS NOT NULL AND MAX(th.manuscript_filepath) IS NULL THEN 60
                        WHEN MAX(th.manuscript_filepath) IS NOT NULL THEN 80
                        ELSE 0
                    END AS progress
                ")
            ])

            ->groupBy('tg.id', 'tg.group_number', 'sa.section', 'sy.year')
            ->orderBy('tg.group_number', 'asc')
            ->limit(10)
            ->get();
        //dd($groups);
        return Inertia::render(
            'Faculty/management/adviser/advisee_management/progress',
            [
                'groups' => $groups
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

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

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
