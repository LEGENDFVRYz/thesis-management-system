<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolYear;
use App\Models\Semester;
use App\Models\User;
use App\Notifications\AcademicYearAnnounced;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Notification;

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

        // dd($active_semestral);

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
        // SCENARIO 1: UPDATING A SEMESTER
        if ($request->filled('sem_index')) {
            
            $validated = $request->validate([
                'sy_year'    => 'required|integer',
                'sem_index'  => 'required|integer|in:0,1',
                'start_date' => 'required|date',
                'end_date'   => 'required|date|after:start_date',
            ]);

            // dd($request);

            $schoolYear = SchoolYear::where('year', $validated['sy_year'])->first();

            if (!$schoolYear) {
                return back()->withErrors(['year' => 'School year not found. Create the year first.']);
            }

            // Ensures to deactivate ALL semesters in the database
            $newSemester = DB::transaction(function () use ($schoolYear, $validated) {
                
                Semester::query()->update(['is_active' => false]);

                // Update or Create the Semester record linked to that School Year
                return Semester::updateOrCreate(
                    [
                        'school_year_id' => $schoolYear->id,
                        'semester'       => $validated['sem_index']
                    ],
                    [
                        'start_date' => $validated['start_date'],
                        'end_date'   => $validated['end_date'],
                        'is_active' => true 
                    ]
                );
            });

            // dd($newSemester->load('schoolYear'));

            // Notify the users:
            // $users = User::all();
            // Notification::send($users, new AcademicYearAnnounced($academicYear));
            
            return redirect()->route('admin.management.academic');
        } 
        
        // SCENARIO 2: UPDATING ACADEMIC YEAR
        else {
            $validated = $request->validate([
                'year'       => 'required|integer',
                'start_date' => 'required|date',
                'end_date'   => 'required|date|after:start_date',
            ]);

            // Update or create the school year
            $schoolYear =SchoolYear::updateOrCreate(
                ['year' => $validated['year']],     // Search by unique year
                [
                    'start_date' => $validated['start_date'],
                    'end_date'   => $validated['end_date'],
                ]
            );

            // Get the currently active semester
            // $activeSemester = Semester::where('is_active', true)->value('semester');

            // Ensures to deactivate ALL semesters in the database
            $newSemester = DB::transaction(function () use ($schoolYear, $validated) {
                
                Semester::query()->update(['is_active' => false]);

                // Force Activate the First Semester (temporary soln -- depends, maybe we used the activeSemester)
                return Semester::updateOrCreate(
                    [
                        'school_year_id' => $schoolYear->id,
                        'semester'       => 0,              
                    ],
                    [
                        'is_active' => true,
                    ]
                );
            });

            // dd($newSemester->load('schoolYear')->toArray());

            // Clear the old notifications
            // DB::table('notifications')
            //     ->where('type', AcademicYearAnnounced::class) // Target this specific notification class
            //     ->whereNull('read_at') // Only remove them if they haven't been read yet
            //     ->delete();

            // Notify the users:
            $users = User::first(); // try
            // Notification::send($users, new AcademicYearAnnounced($newSemester->load('schoolYear')->toArray()));
            $users->notify(
                new AcademicYearAnnounced($newSemester->load('schoolYear'))
            );

            return redirect()->route('admin.management.academic');
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
