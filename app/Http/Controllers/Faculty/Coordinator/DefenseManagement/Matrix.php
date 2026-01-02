<?php

namespace App\Http\Controllers\Faculty\Coordinator\DefenseManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class Matrix extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 3.1: Timo       --part 1/4

        // Main Query: Query all the valid schedule set by the coordinator      --note: date and timestamp

        // Render and Props

        // Subquery for active school year
        $activeYearSub = DB::table('tbl_school_years as sy2')
            ->join('tbl_semesters as sem2', 'sy2.id', '=', 'sem2.school_year_id')
            ->where('sem2.is_active', 1)
            ->select('sy2.year')
            ->limit(1);

        // Subquery for confirmed panels
        $confirmedPanelsSub = DB::table('tbl_endorsed_panels as ep')
            ->join('tbl_faculty_assignments as fa', 'ep.panel_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->where('ep.is_confirmed', true)
            ->select(
                'ep.defense_matrix_id',
                DB::raw("GROUP_CONCAT(
                    CONCAT(COALESCE(f.name_prefix,''), ' ', COALESCE(f.last_name,''), 
                    IF(f.suffix IS NOT NULL AND f.suffix <> '', CONCAT(' ', f.suffix), '')) 
                    SEPARATOR ', '
                ) AS confirmed_panels"),
                DB::raw('COUNT(*) AS panel_count')
            )
            ->groupBy('ep.defense_matrix_id');

        // Subquery for proponents
        $proponentsSub = DB::table('tbl_students as s')
            ->select(
                's.group_id',
                DB::raw("GROUP_CONCAT(
                    CONCAT(COALESCE(s.first_name,''), ' ', COALESCE(s.last_name,''), 
                    IF(s.suffix IS NOT NULL AND s.suffix <> '', CONCAT(' ', s.suffix), '')) 
                    SEPARATOR ', '
                ) AS proponents")
            )
            ->groupBy('s.group_id');

        // Main query
        $defenseMatrices = DB::table('tbl_defense_matrices as dm')
            ->join('tbl_endorsements as e', 'dm.endorsement_id', '=', 'e.id')
            ->join('tbl_theses as t', 'e.thesis_id', '=', 't.id')
            ->join('tbl_proposals as p', 't.proposal_id', '=', 'p.id')
            ->join('tbl_thesis_groups as tg', 'p.group_id', '=', 'tg.id')
            ->join('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->join('tbl_faculty_assignments as fa_sy', 'sa.faculty_assign_id', '=', 'fa_sy.id')
            ->join('tbl_school_years as sy', 'fa_sy.sy_id', '=', 'sy.id')
            ->join('tbl_faculties as adv', 'fa_sy.faculty_id', '=', 'adv.id')
            ->leftJoinSub($confirmedPanelsSub, 'cp', function($join) {
                $join->on('cp.defense_matrix_id', '=', 'dm.id');
            })
            ->leftJoinSub($proponentsSub, 'st', function($join) {
                $join->on('st.group_id', '=', 'tg.id');
            })
            ->leftJoinSub($activeYearSub, 'ays', function($join) {
                $join->on(DB::raw('1'), '=', DB::raw('1')); // cross join
            })
            ->select(
                'dm.id',
                DB::raw('DATE(dm.defense_schedule) AS defense_date'),
                DB::raw('TIME(dm.defense_schedule) AS defense_time'),
                'dm.defense_room',
                't.title AS project_title',

                // group_code
                DB::raw("CONCAT((3 + (ays.year - sy.year)), sa.section, LPAD(tg.group_number, 2, '0')) AS group_code"),

                // year_level
                DB::raw("LEFT(CONCAT((3 + (ays.year - sy.year)), sa.section, LPAD(tg.group_number, 2, '0')), 1) AS year_level"),

                // section
                DB::raw("SUBSTRING(CONCAT((3 + (ays.year - sy.year)), sa.section, LPAD(tg.group_number, 2, '0')), 2, LENGTH(CONCAT((3 + (ays.year - sy.year)), sa.section, LPAD(tg.group_number, 2, '0'))) - 3) AS section"),

                // section adviser
                DB::raw("CONCAT(COALESCE(adv.name_prefix,''), ' ', COALESCE(adv.first_name,''), ' ', COALESCE(adv.last_name,''), IF(adv.suffix IS NOT NULL AND adv.suffix <> '', CONCAT(' ', adv.suffix), '')) AS section_adviser"),

                'cp.confirmed_panels',
                'st.proponents',

                DB::raw("CASE WHEN cp.panel_count = 3 THEN 'SCHEDULED' ELSE 'PENDING' END AS status")
            )
            ->get();

        return Inertia::render('Faculty/management/coordinator/defense_management/matrix', [
            'defenseMatrices' => $defenseMatrices,
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
        // TASK 3.1: Timo       --part 2/4
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Used the testing modal to create a group and get all need information

        // Saved it into the database
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
        // TASK 3.1: Timo       --part 3/4
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Same logic to create but you should update change data only
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // TASK 3.1: Timo       --part 4/4
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Delete the selected date schedule
    }
}
