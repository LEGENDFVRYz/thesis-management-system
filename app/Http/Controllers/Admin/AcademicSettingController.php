<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Academic\AcademicPeriodRepository;
use App\Services\AcademicSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicSettingController extends Controller
{
    public function __construct(
        protected AcademicPeriodRepository $academicPeriods,
        protected AcademicSettingService $academicSettings,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Pull the active semestral record
        $active = $this->academicPeriods->activeSemester();

        // Get the value for active s.y. and sem
        $active_acad_year = $active?->schoolYear?->year;
        $active_semestral = $active?->semester;

        // --- PREPARE THE DATA FOR THE DYNAMIC INPUTED DROPDOWM ---
        // Get all the school years that in the scoped range
        $currentYear = (int) date('Y');
        $valid_sy = $this->academicPeriods->schoolYearsBetween($currentYear - 2, $currentYear + 1);

        // Make the options for dynamic dropdown in academic configuration
        $schoolYears = [];

        for ($year = $currentYear - 2; $year <= $currentYear; $year++) {
            $sy = $valid_sy->get($year);
            $sy_semesters = [];

            if ($sy) {
                foreach ($sy->semesters as $sem) {
                    $sy_semesters[$sem->semester] = [
                        'start' => $sem->start_date?->toDateString(),
                        'end' => $sem->end_date?->toDateString(),
                    ];
                }
            }

            $schoolYears[$year] = [
                'start' => $sy?->start_date?->toDateString(),
                'end' => $sy?->end_date?->toDateString(),
                'semesters' => $sy_semesters,
            ];
        }

        return Inertia::render('Admin/management/academic', [
            'active_sy' => $active_acad_year,
            'active_sem' => $active_semestral,
            'school_year' => $schoolYears,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // SCENARIO 1: UPDATING A SEMESTER
        if ($request->filled('sem_index')) {
            $validated = $request->validate([
                'sy_year' => 'required|integer',
                'sem_index' => 'required|integer|in:0,1',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
            ]);

            try {
                $this->academicSettings->updateSemester($validated);
            } catch (\RuntimeException $e) {
                return back()->withErrors(['year' => $e->getMessage()]);
            }

            return back()->with('success', 'Academic Semester updated successfully');
        }

        // SCENARIO 2: UPDATING ACADEMIC YEAR
        $validated = $request->validate([
            'year' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $this->academicSettings->updateAcademicYear($validated);

        return back()->with('success', 'Academic Year has change successfully');
    }
}
