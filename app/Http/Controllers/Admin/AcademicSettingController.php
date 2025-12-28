<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolYear;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Pull the active semestral recorc
        $active = Semester::with('schoolYear')
                                ->where('is_active', true)
                                ->first();

        // Get the value for active s.y. and sem
        $active_acad_year               = $active?->schoolYear?->year;
        $active_semestral               = $active?->semester;

        // --- PREPARE THE DATA FOR THE DYNAMIC INPUTED DROPDOWM ---
        // Get all the school years that in the scoped range
        $currentYear = (int) date('Y');
        $valid_sy = SchoolYear::with('semesters')
                                ->whereBetween('year', [$currentYear - 2, $currentYear + 1])
                                ->get()
                                ->keyBy('year');

        // Make the options for dynamic dropdown in academic configuration
        $schoolYears = [];

        for ($year = $currentYear - 2; $year <= $currentYear; $year++) {
            $sy = $valid_sy->get($year);
            $sy_semesters = [];

            if ($sy) {
                foreach ($sy->semesters as $sem) {
                    $sy_semesters[$sem->semester] = [
                        'start' => $sem->start_date?->toDateString(),
                        'end'   => $sem->end_date?->toDateString(),
                    ];
                }
            }

            $schoolYears[$year] = [
                'start'     => $sy?->start_date?->toDateString(),
                'end'       => $sy?->end_date?->toDateString(),
                'semesters' => $sy_semesters,
            ];
        };

        // dd($schoolYears);

        return Inertia::render('Admin/management/academic', [
            'active_sy'     => $active_acad_year,
            'active_sem'    => $active_semestral,
            'school_year'   => $schoolYears
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
    public function update(Request $request)
    {
        $request->validate([
            'year'       => 'required|integer',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
        ]);

        // dd($request->all());
        
        // 🔑 Extract the year from the END DATE
        SchoolYear::updateOrCreate(
            ['year' => $request->year], // unique identifier
            [
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
            ]
        );
        
        // dd($schoolYear);
        
        return redirect()->route('admin.management.academic.update');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
