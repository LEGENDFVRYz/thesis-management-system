<?php

namespace App\Http\Controllers\Faculty\Coordinator\ThesisMonitoring;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ThesisRegistry extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? 2025;

        $rawTheses = DB::table('tbl_endorsements as e')
            ->join('tbl_theses as t', 'e.thesis_id', '=', 't.id')
            ->join('tbl_proposals as p', 't.proposal_id', '=', 'p.id')
            ->join('tbl_thesis_groups as tg', 'p.group_id', '=', 'tg.id')
            ->join('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->join('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->where('e.is_adviser_approved', 1)
            ->where('e.is_coordinator_approved', 1)
            ->select(
                'tg.id as group_id',
                // Generate Group Code: e.g. 4101
                DB::raw("CONCAT((3 + ($activeYear - sy.year)), sa.section, LPAD(tg.group_number, 2, '0')) AS group_code"),
                't.title',
                DB::raw("CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) AS adviser"),
                // Generate Block: e.g. BSCPE 4-1
                DB::raw("CONCAT('BSCPE ', (3 + ($activeYear - sy.year)), '-', sa.section) AS block"),
                'def.defense_schedule',
                'def.course as stage'
            )
            ->get();

        $theses = $rawTheses->map(function ($t) {
            $proponents = DB::table('tbl_students')
                ->where('group_id', $t->group_id)
                ->select('id', DB::raw("CONCAT(first_name, ' ', last_name) as name"))
                ->get();

            $dateObj = $t->defense_schedule ? Carbon::parse($t->defense_schedule) : null;

            return [
                'id' => $t->group_code,
                'title' => $t->title,
                'adviser' => $t->adviser,
                'block' => $t->block,
                'date' => $dateObj ? $dateObj->format('F d, Y') : 'TBA',
                'time' => $dateObj ? $dateObj->format('h:i A') : 'TBA',
                // 'status' => 'On-Track',
                'stage' => strtolower($t->stage), 
                'proponents' => $proponents->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name
                ])->toArray()
            ];
        });

        return Inertia::render('Faculty/management/coordinator/thesis_monitoring/thesis_registry', [
            'theses' => $theses
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
