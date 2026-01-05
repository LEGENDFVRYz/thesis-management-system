<?php

namespace App\Http\Controllers\Faculty\Joint1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DefenseManagement extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 4.3: Maryel     --part 1/2

        // Check the filter requests

        // Main Query: check the figma and task description
        // note: query also the view modal details, especially assigned panel in tbl_endorsement_panels

        $facultyId = DB::table('tbl_faculties')
            ->where('user_id', auth()->id())
            ->value('id');
    
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? 2025;
    
        $defenses = DB::table('tbl_endorsements as e')
            ->join('tbl_theses as t', 'e.thesis_id', '=', 't.id')
            ->join('tbl_proposals as p', 't.proposal_id', '=', 'p.id')
            ->join('tbl_thesis_groups as tg', 'p.group_id', '=', 'tg.id')
            ->join('tbl_students as s', 'tg.id', '=', 's.group_id')
            ->join('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id') // This is the Adviser
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->where('e.is_adviser_approved', 1)
            ->where('e.is_coordinator_approved', 1)
            ->where(function ($query) use ($facultyId) {
                $query->where('fa.faculty_id', $facultyId) // User is Adviser
                    ->orWhereExists(function ($sub) use ($facultyId) { // User is Panelist
                        $sub->select(DB::raw(1))
                            ->from('tbl_endorsed_panels as ep')
                            ->join('tbl_faculty_assignments as fa_pan', 'ep.panel_id', '=', 'fa_pan.id')
                            ->whereColumn('ep.defense_matrix_id', 'def.id')
                            ->where('fa_pan.faculty_id', $facultyId);
                    });
            })
            ->groupBy(
                'e.id', 'def.id', 't.id', 't.title', 'def.defense_schedule',
                'f.id', 'f.name_prefix', 'f.first_name', 'f.last_name',
                's.section', 'sy.year', 'def.course', 'def.defense_room'
            )
            ->select(DB::raw("
                e.id as endorsement_id,
                def.id as defense_matrix_id,
                t.title,
                f.id as adviser_faculty_id,
                GROUP_CONCAT(DISTINCT CONCAT(s.first_name, ' ', s.last_name) SEPARATOR ', ') AS authors,
                CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) AS adviser,
                CONCAT('BSCPE ', (3 + ($activeYear - sy.year)), '-', s.section) AS section,
                def.defense_schedule,
                DATE(def.defense_schedule) as date,
                TIME(def.defense_schedule) as time,
                def.course,
                def.defense_room as venue
            "))
            ->get()
            ->map(function ($defense) use ($facultyId) {
                // Fetch all panels for this defense
                $panels = DB::table('tbl_endorsed_panels as ep')
                    ->join('tbl_faculty_assignments as fa', 'ep.panel_id', '=', 'fa.id')
                    ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
                    ->where('ep.defense_matrix_id', $defense->defense_matrix_id)
                    ->select(
                        'ep.id',
                        'ep.is_confirmed',
                        'fa.role_id',
                        'fa.faculty_id',
                        DB::raw("CONCAT(f.name_prefix,' ',f.first_name,' ',f.last_name) AS name")
                    )
                    ->get();
    
                $defense->panels = $panels;
    
                // FIX: Check adviser status using the ID from the main query, 
                // not the panels table (unless your system specifically puts advisers in tbl_endorsed_panels)
                $defense->is_adviser = ($defense->adviser_faculty_id == $facultyId);
    
                // Check if the current user is a panelist in this specific defense
                $panelSelf = $panels->first(function ($p) use ($facultyId) {
                    return $p->faculty_id == $facultyId;
                });
    
                $defense->is_panelist = !is_null($panelSelf);
                $defense->panel_status = $panelSelf ? $panelSelf->is_confirmed : null;
    
                return $defense;
            });
    
        // Pending: Only show if I am a panelist and haven't responded yet
        $pendingRequests = $defenses->filter(function ($d) {
            return $d->is_panelist && is_null($d->panel_status);
        })->values();
    
        // Accepted: Show if I am the adviser OR if I am a panelist and I already accepted
        $acceptedRequests = $defenses->filter(function ($d) {
            return $d->is_adviser || ($d->is_panelist && $d->panel_status == 1);
        })->values();

        // dd(vars: [
        //     'defenses'         => $defenses,
        //     'pendingRequests'  => $pendingRequests,
        //     'acceptedRequests' => $acceptedRequests,
        // ]);

        return Inertia::render('Faculty/management/adviser/defense_management', [
            'pendingRequests'  => $pendingRequests,
            'acceptedRequests' => $acceptedRequests,
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
        // TASK 4.3: Maryel     --part 2/2
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Validate if the login faculty user and the panel accept/reject request is the same, if not: invalid operation
        // note: Boolean marker for "is_confirmed" for approve/reject representation in panel request
        // note: Null is default for "is_confirmed" is pending...

        // Saved the update into the database

        $validated = $request->validate([
            'is_confirmed' => ['required', 'boolean'],
        ]);

        $facultyId = DB::table('tbl_faculties')
            ->where('user_id', auth()->id())
            ->value('id');

        if (!$facultyId) {
            abort(403, 'Faculty record not found.');
        }

        DB::beginTransaction();

        try {
            $panel = DB::table('tbl_endorsed_panels as ep')
                ->join('tbl_faculty_assignments as fa', 'ep.panel_id', '=', 'fa.id')
                ->where('ep.defense_matrix_id', $id)
                ->where('fa.faculty_id', $facultyId)
                ->where('fa.role_id', 6)
                ->select('ep.id', 'ep.is_confirmed')
                ->first();

            if (!$panel) {
                abort(403, 'Panel request not found or unauthorized.');
            }

            if (!is_null($panel->is_confirmed)) {
                return back()->with(
                    'error',
                    $panel->is_confirmed
                        ? 'You have already accepted this panel request.'
                        : 'You have already rejected this panel request.'
                );
            }

            DB::table('tbl_endorsed_panels')
                ->where('id', $panel->id)
                ->update([
                    'is_confirmed' => $validated['is_confirmed'],
                ]);

            DB::commit();

            $message = $validated['is_confirmed']
                ? 'Panel request accepted successfully.'
                : 'Panel request rejected successfully.';

            return back()->with('success', $message);

        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
