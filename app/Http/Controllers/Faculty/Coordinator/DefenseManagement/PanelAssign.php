<?php

namespace App\Http\Controllers\Faculty\Coordinator\DefenseManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PanelAssign extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 4.1: Maryel       --part 1/3
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic
        
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? 2025;

        $sections = DB::table('tbl_students as s')
            // Join tbl_school_years to get the year for the calculation
            ->join('tbl_thesis_groups as tg', 's.group_id', '=', 'tg.id')
            ->join('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->select(DB::raw("CONCAT('BSCPE ', (3 + ($activeYear - sy.year)), '-', s.section) AS section"))
            ->distinct()
            ->orderBy('s.section', 'asc')
            ->get();
        // dd(vars: $sections);

        // Main Query 1: Query all the valid available panels that active in the academic semester  
        $available_panel = DB::table('tbl_faculties as f')
            ->join('tbl_faculty_assignments as fa', 'f.id', '=', 'fa.faculty_id')
            ->join('tbl_faculty_roles as fr', 'fa.role_id', '=', 'fr.id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->join('tbl_semesters as sem', 'sy.id', '=', 'sem.school_year_id')
            ->where('fr.id', 6)
            ->where('fa.is_active', 1)
            ->where('sem.is_active', 1)
            ->select(DB::raw("
                f.id,
                CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) as name"))
            ->get();
        //dd(vars: $available_panel);

        // Main Query 2: Query all the endorse thesis 
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
            ->groupby('e.id', 'def.id', 't.id', 't.title', 'def.defense_schedule', 'f.name_prefix', 'f.first_name', 'f.last_name', 'section')
            ->select(DB::raw("
                e.id as endorsement_id,
                def.id as defense_matrix_id,
                t.id as thesis_id,
                t.title,
                GROUP_CONCAT(DISTINCT CONCAT(s.first_name, ' ', s.last_name) SEPARATOR ', ') AS authors,
                CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) AS adviser,
                CONCAT('BSCPE ', (3 + ($activeYear - sy.year)), '-', s.section) AS section,
                DATE(def.defense_schedule) as date"))
            ->get()
            ->map(function ($thesis) {
                $panels = DB::table('tbl_endorsed_panels as ep')
                    ->join('tbl_faculty_assignments as fa', 'ep.panel_id', '=', 'fa.id')
                    ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
                    ->where('ep.defense_matrix_id', $thesis->defense_matrix_id)
                    ->select(
                        'f.id',
                        DB::raw("CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) as name")
                    )
                    ->get();

                $thesis->panels = $panels->map(function($panel) {
                    return [
                        'id' => $panel->id,
                        'name' => $panel->name
                    ];
                })->toArray();
                
                $thesis->panel_count = count($thesis->panels);
                $thesis->is_complete = $thesis->panel_count === 3;
                
                return $thesis;
            });
        // dd(vars: $endorsed_thesis);

        // Render and Props
        return Inertia::render('Faculty/management/coordinator/defense_management/panel_assign', props: [
            'sections' => $sections,
            'available_panel' => $available_panel,
            'endorsed_thesis' => $endorsed_thesis,
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
        // TASK 4.1: Maryel       --part 2/3
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Used the testing modal to create a group and get all need information
        
        // Saved all the 3 panels selected in the tbl_endorse_panels
        // Saved it into the database

        $request->validate([
            'defense_matrix_id' => 'required|exists:tbl_defense_matrices,id',
            'panel_ids' => 'required|array|size:3',
            'panel_ids.*' => [
                'required',
                'distinct',
                Rule::exists('tbl_faculty_assignments', 'faculty_id')->where(function ($query) {
                    $query->where('role_id', 6);
                }),
            ],
        ], [
            'panel_ids.size' => 'Exactly 3 panelists must be assigned.',
            'panel_ids.*.distinct' => 'This faculty member is already assigned to this panel.',
            'panel_ids.*.exists' => 'One or more selected faculty are not authorized panelists.',
        ]);
        
        if (count($request->panel_ids) !== count(array_unique($request->panel_ids))) {
            return redirect()->back()->with('error', 'This faculty member is already assigned to this panel.');
        }

        DB::beginTransaction();
        try {
            $existingCount = DB::table('tbl_endorse_panels')
                ->where('defense_matrix_id', $request->defense_matrix_id)
                ->count();

            if ($existingCount > 0) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Panel assignments already exist.');
            }

            $records = array_map(function($faculty_id) use ($request) {
                return [
                    'defense_matrix_id' => $request->defense_matrix_id,
                    'panel_id' => $faculty_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $request->panel_ids);

            DB::table('tbl_endorse_panels')->insert($records);

            DB::commit();
            return redirect()->back()->with('success', 'Panel assigned successfully (3 panelists).');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to assign panel: ' . $e->getMessage());
        }
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
        // TASK 4.1: Maryel       --part 3/3
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Same logic to create but you should update change data only

        $request->validate([
            'defense_matrix_id' => 'required|exists:tbl_defense_matrices,id',
            'panel_ids' => 'required|array|size:3',
            'panel_ids.*' => [
                'required',
                'distinct',
                Rule::exists('tbl_faculty_assignments', 'faculty_id')->where(function ($query) {
                    $query->where('role_id', 6);
                }),
            ],
        ], [
            'panel_ids.size' => 'Exactly 3 panelists must be assigned.',
            'panel_ids.*.distinct' => 'This faculty member is already assigned to this panel.',
            'panel_ids.*.exists' => 'One or more selected faculty are not authorized panelists.',
        ]);

        if (count($request->panel_ids) !== count(array_unique($request->panel_ids))) {
            return redirect()->back()->with('error', 'This faculty member is already assigned to this panel.');
        }
        
        DB::beginTransaction();
        try {
            DB::table('tbl_endorse_panels')
            ->where('defense_matrix_id', $request->defense_matrix_id)
            ->delete();

            $records = array_map(function($faculty_id) use ($request) {
                return [
                    'defense_matrix_id' => $request->defense_matrix_id,
                    'panel_id' => $faculty_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $request->panel_ids);

            DB::table('tbl_endorse_panels')->insert($records);

            DB::commit();
            return redirect()->back()->with('success', 'Panel assignments updated successfully.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to remove panelist: ' . $e->getMessage());
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
