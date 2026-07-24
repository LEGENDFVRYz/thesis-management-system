<?php

namespace App\Http\Controllers\Faculty\Coordinator\DefenseManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PanelAssign extends Controller
{
    public function index()
    {
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? 2025;

        $sections = DB::table('tbl_students as s')
            ->join('tbl_thesis_groups as tg', 's.group_id', '=', 'tg.id')
            ->join('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->select(DB::raw("CONCAT('BSCPE ', (3 + ($activeYear - sy.year)), '-', s.section) AS section"))
            ->distinct()
            ->orderBy('section', 'asc')
            ->get();

        $available_panel = DB::table('tbl_faculties as f')
            ->join('tbl_faculty_assignments as fa', 'f.id', '=', 'fa.faculty_id')
            ->join('tbl_faculty_roles as fr', 'fa.role_id', '=', 'fr.id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->join('tbl_semesters as sem', 'sy.id', '=', 'sem.school_year_id')
            ->where('fr.id', 6)
            ->where('fa.is_active', 1)
            ->where('sem.is_active', 1)
            ->select('fa.id as id', DB::raw("CONCAT(f.name_prefix,' ',f.first_name,' ',f.last_name) as name"))
            ->get();

        $endorsed_thesis = DB::table('tbl_endorsements as e')
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
            ->groupBy('e.id', 'def.id', 't.id', 't.title', 'def.defense_schedule', 'f.name_prefix', 'f.first_name', 'f.last_name', 'section')
            ->select(DB::raw("
                e.id as endorsement_id,
                def.id as defense_matrix_id,
                t.id as thesis_id,
                t.title,
                GROUP_CONCAT(DISTINCT CONCAT(s.first_name, ' ', s.last_name) SEPARATOR ', ') AS authors,
                CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) AS adviser,
                CONCAT('BSCPE ', (3 + ($activeYear - sy.year)), '-', s.section) AS section,
                DATE(def.defense_schedule) as date
            "))
            ->get()
            ->map(function ($thesis) {
                $panels = DB::table('tbl_endorsed_panels as ep')
                    ->join('tbl_faculty_assignments as fa', 'ep.panel_id', '=', 'fa.id')
                    ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
                    ->where('ep.defense_matrix_id', $thesis->defense_matrix_id)
                    ->select(
                        'fa.id',
                        DB::raw("CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) as name"),
                        'ep.is_confirmed'
                    )
                    ->get();

                $thesis->panels = $panels->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'is_confirmed' => $p->is_confirmed 
                ])->toArray();

                $thesis->panel_count = count(array_filter($thesis->panels, fn($p) => $p['is_confirmed'] === 1));
                $thesis->is_complete = $thesis->panel_count >= 3;

                return $thesis;
            });

        return Inertia::render('Faculty/management/coordinator/defense_management/panel_assign', [
            'sections' => $sections,
            'available_panel' => $available_panel,
            'endorsed_thesis' => $endorsed_thesis,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'defense_matrix_id' => 'required|exists:tbl_defense_matrices,id',
            'panel_ids' => 'required|array|min:3|max:3', // Enforce exactly 3
            'panel_ids.*' => 'distinct|exists:tbl_faculty_assignments,id'
        ]);

        DB::beginTransaction();
        try {
            // 1. SYNC STRATEGY: Remove panelists NOT in the new list
            // This handles removals and swaps correctly.
            DB::table('tbl_endorsed_panels')
                ->where('defense_matrix_id', $request->defense_matrix_id)
                ->whereNotIn('panel_id', $request->panel_ids)
                ->delete();

            // 2. Add or Update the requested panelists
            foreach ($request->panel_ids as $panelId) {
                DB::table('tbl_endorsed_panels')->updateOrInsert(
                    [
                        'defense_matrix_id' => $request->defense_matrix_id,
                        'panel_id' => $panelId,
                    ],
                    [
                        // Ensure is_confirmed is set to 0 (Pending) if adding new
                        // You can change this logic if you want to preserve existing status
                        'is_confirmed' => 0, 
                    ]
                );
            }

            DB::commit();
            // Inertia requires a redirect back, not JSON
            return back()->with('success', 'Panel assignments saved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Since we are syncing the full list of 3 panels,
        // the logic is identical to store.
        return $this->store($request);
    }
}