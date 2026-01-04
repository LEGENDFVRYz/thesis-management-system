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
    {
        $groups = DB::table('tbl_thesis_groups as tg')

            // Core joins
            ->leftJoin('tbl_proposals as tp', 'tg.id', '=', 'tp.group_id')
            ->leftJoin('tbl_theses as t', 'tp.id', '=', 't.proposal_id')
            ->leftJoin('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->leftJoin('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->leftJoin('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->leftJoin('users as u', 'f.user_id', '=', 'u.id')

            ->select([
                'tg.id as group_id',
                'tg.group_number',
                'sa.section as block',

                // Proposal
                'tp.proposal_title',

                // Count proponents
                DB::raw("
                    (
                        SELECT COUNT(*)
                        FROM tbl_students
                        WHERE tbl_students.group_id = tg.id
                    ) as proponents_count
                "),

                // Placeholder
                DB::raw("'N/A' as thesis_stage"),

                // Calculated status
                DB::raw("
                    CASE
                        WHEN t.id IS NOT NULL THEN 'Active'
                        ELSE 'Pending'
                    END as calculated_status
                "),
            ])

            ->orderBy('tg.group_number', 'asc')
            ->limit(10)
            ->get();

        dd($groups);
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
