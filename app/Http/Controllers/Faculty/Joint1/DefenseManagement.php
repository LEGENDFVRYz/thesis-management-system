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
        
        $userId = auth()->id();

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
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->where('e.is_adviser_approved', 1)
            ->where('e.is_coordinator_approved', 1)
            ->where(function($query) use ($userId) {
                $query->where('fa_adv.faculty_id', $userId) // Check if user is the Adviser
                      ->orWhereExists(function ($subquery) use ($userId) {
                          $subquery->select(DB::raw(1))
                              ->from('tbl_endorsed_panels as ep')
                              ->join('tbl_faculty_assignments as fa_pan', 'ep.panel_id', '=', 'fa_pan.id')
                              ->whereColumn('ep.defense_matrix_id', 'def.id')
                              ->where('fa_pan.faculty_id', $userId); // Check if user is a Panelist
                      });
            })
            ->groupBy('e.id', 'def.id', 't.id', 't.title', 'def.defense_schedule', 'f.name_prefix', 'f.first_name', 'f.last_name', 's.section', 'sy.year', 'def.course', 'def.defense_room')
            ->select(DB::raw("
                e.id as endorsement_id,
                def.id as defense_matrix_id,
                t.title,
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
            ->map(function ($defense) use ($userId) {
                $panels = DB::table('tbl_endorsed_panels as ep')
                    ->join('tbl_faculty_assignments as fa', 'ep.panel_id', '=', 'fa.id')
                    ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
                    ->where('ep.defense_matrix_id', $defense->defense_matrix_id)
                    ->select(
                        'ep.id as panel_id',
                        'f.id as faculty_id', // This is the actual Faculty surrogate key
                        DB::raw("CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) as name"),
                        'ep.is_confirmed'
                    )
                    ->get();
            
                $defense->panels = $panels->toArray();
                $defense->panel_count = count($defense->panels);
                $defense->is_complete = $defense->panel_count >= 3; 
                
                // Identify user's role: Check if User ID matches Adviser OR if User ID exists in the panels via the faculty_id
                $isAdviser = ($defense->adviser_id == $userId);
                $isPanelist = collect($defense->panels)->contains('faculty_id', $userId);
            
                if ($isAdviser && $isPanelist) {
                    $defense->user_role = 'Adviser & Panelist';
                } elseif ($isAdviser) {
                    $defense->user_role = 'Adviser';
                } else {
                    $defense->user_role = 'Panelist';
                }
                
                $defense->all_confirmed = $panels->isNotEmpty() && $panels->every('is_confirmed', 1);
            
                return $defense;
            });
            // dd(vars: $defenses);
    
        // Main Query 2: All Accepted Requests will be displayed for the “Calendar View” Button
        $acceptedRequests = $defenses->where('all_confirmed', true)->values();
        // dd(vars: $acceptedRequests);

        return Inertia::render('Faculty/management/adviser/defense_management', [
            'defenses' => $defenses,
            'acceptedRequests' => $acceptedRequests
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
        $facultyId = Auth::id();

        $validated = $request->validate([
            'is_confirmed' => ['required', 'boolean']
        ]);

        $panel = DB::table('tbl_endorsed_panels as ep')
            ->join('tbl_defense_matrices as def', 'ep.defense_matrix_id', '=', 'def.id')
            ->where('def.endorsement_id', $id)
            ->select('ep.id', 'ep.is_confirmed', 'ep.panel_id')
            ->first();

        if (!$panel) {
            return back()->with('error', 'Panel request not found.');
        }

        if ($panel->panel_id != $facultyId) {
            return back()->with('error', 'Invalid operation: You are not authorized to respond to this panel request.');
        }

        // Check if already confirmed/rejected (prevent duplicate responses)
        if ($panel->is_confirmed !== null) {
            $status = $panel->is_confirmed ? 'accepted' : 'rejected';
            return back()->with('error', "This panel request has already been {$status}.");
        }

        DB::table('tbl_endorsed_panels')
            ->where('id', $panel->id)
            ->update([
                'is_confirmed' => $validated['is_confirmed'],
                'updated_at' => now()
            ]);

        $message = $validated['is_confirmed'] 
            ? 'Panel request accepted successfully.' 
            : 'Panel request rejected successfully.';

        return back()->with('success', $message);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
