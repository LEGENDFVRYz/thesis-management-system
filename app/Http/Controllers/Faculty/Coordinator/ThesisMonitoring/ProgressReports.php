<?php

namespace App\Http\Controllers\Faculty\Coordinator\ThesisMonitoring;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProgressReports extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $course = $request->input('course', 'MOR');

        $submissions = DB::table('tbl_endorsements as e')
            ->join('tbl_theses as t', 'e.thesis_id', '=', 't.id')
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->where('def.course', $course)
            ->where('e.is_adviser_approved', 1)
            ->where('e.is_coordinator_approved', 1)
            ->selectRaw("
                YEAR(t.created_at) as year,
                COUNT(e.id) AS submission_count
            ")
            ->groupBy(DB::raw('YEAR(t.created_at)'))
            ->distinct()
            ->get();

        $completed = DB::table('tbl_endorsements as e')
            ->join('tbl_theses as t', 'e.thesis_id', '=', 't.id')
            ->join('tbl_defense_matrices as def', 'e.id', '=', 'def.endorsement_id')
            ->join('tbl_defense_evaluations as eval', 'def.id', '=', 'eval.defense_id')
            ->where('def.course', $course)
            ->whereRaw("UPPER(eval.remarks) LIKE '%APPROVED%'")
            ->selectRaw("
                YEAR(def.defense_schedule) as year,
                COUNT(eval.id) AS completed_count
            ")
            ->groupBy(DB::raw('YEAR(def.defense_schedule)'))
            ->distinct()
            ->get();
        
        // dd($course, $submissions, $completed);

        return Inertia::render('Faculty/management/coordinator/thesis_monitoring/progress', [
                'course' => $course,
                'submission' => $submissions,
                'completed' => $completed
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // creating pdf report
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
