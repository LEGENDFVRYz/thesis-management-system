<?php

namespace App\Http\Controllers\Faculty\Coordinator\ThesisMonitoring;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ThesisRegistry extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // ===================================
        // For Revision:
        // - Wrong method getting the group code (check the admin/student for reference)
        // - Note: There is new structure in the database to get the events, check it
        // ===================================


        $groups = DB::table('tbl_thesis_groups as tg')
            ->leftJoin('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->leftJoin('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')

            // Adviser
            ->leftJoin('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->leftJoin('users as u_adv', 'f.user_id', '=', 'u_adv.id')

            // School Year (for Group Code)
            ->leftJoin('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')

            // Events Structure (new)
            ->leftJoin('tbl_semesters as sem', 'sem.school_year_id', '=', 'sy.id')
            ->leftJoin('tbl_events as e', 'e.semester_id', '=', 'sem.id')
            ->leftJoin('tbl_milestones as m', 'm.id', '=', 'e.milestone_id')

            // Thesis & Proposal
            ->leftJoin('tbl_proposals as p', 'tg.id', '=', 'p.group_id')
            ->leftJoin('tbl_theses as t', 'p.id', '=', 't.proposal_id')

            ->select([
                'tg.id as group_id',
                'tg.group_number',

                // BLOCK
                'sa.section as block',

                // GROUP CODE
                DB::raw("CONCAT(sy.year, '-', sa.section, '-', LPAD(tg.group_number, 2, '0')) as group_code"),

                DB::raw("COALESCE(p.updated_at, 'N/A') as last_updated"),
                DB::raw("CONCAT('DEF-', LPAD(tg.id, 3, '0')) as defense_id"),
                DB::raw("COALESCE(t.title, p.proposal_title, 'No Title Yet') as thesis_title"),
                DB::raw("IFNULL(u_adv.name, 'TBA') as adviser_name"),

                // Proponents
                DB::raw("
                    (
                        SELECT GROUP_CONCAT(CONCAT(first_name, ' ', last_name) SEPARATOR ', ')
                        FROM tbl_students
                        WHERE group_id = tg.id
                    ) as proponents
                "),

                // Event Details
                DB::raw("IFNULL(m.name, 'No Active Milestone') as current_event_name"),
                'e.start_date as deadline',
                DB::raw("DATEDIFF(e.start_date, NOW()) as days_remaining"),

                // STATUS LOGIC
                DB::raw("
                    CASE
                        WHEN e.start_date < CURDATE() AND (
                            (m.stage = 1 AND p.id IS NULL) OR
                            ((m.stage = 2 OR m.stage = 3) AND t.id IS NULL)
                        ) THEN 'Critical'

                        WHEN (m.stage = 1 AND p.id IS NULL) THEN 'At Risk'
                        WHEN ((m.stage = 2 OR m.stage = 3) AND t.id IS NULL) THEN 'At Risk'
                        WHEN e.id IS NULL THEN 'No Events'
                        ELSE 'On Track'
                    END as status
                "),
            ])

            ->orderByRaw("
                (e.start_date < CURDATE() AND (p.id IS NULL OR t.id IS NULL)) DESC
            ")
            ->orderByRaw("
                ABS(DATEDIFF(e.start_date, NOW())) ASC
            ")
            ->get();
        //dd($groups);
        return Inertia::render(
            'Faculty/management/coordinator/thesis_monitoring/thesis_registry',
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
