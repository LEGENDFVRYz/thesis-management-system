<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Notifications\AcademicYearAnnounced;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 1. Get Active Semester & School Year via SQL Join
        $activeTerm = DB::table('tbl_semesters')
            ->join('tbl_school_years', 'tbl_semesters.school_year_id', '=', 'tbl_school_years.id')
            ->where('tbl_semesters.is_active', true)
            ->select(
                'tbl_semesters.id as semester_id',
                'tbl_semesters.semester',       // 0 = 1st, 1 = 2nd
                'tbl_school_years.year',        // e.g., 2025
                'tbl_school_years.start_date',  // e.g., 2025-08-01
                'tbl_school_years.end_date'     // e.g., 2026-05-30
            )
            ->first();

        // 2. Fallback if no active semester is found (Safety)
        if (!$activeTerm) {
            $activeTerm = (object) [
                'semester' => 0, 
                'year' => date('Y'),
                'display_sy' => date('Y') . '-' . (date('Y') + 1)
            ];
        } else {
            // Create a display string like "2025-2026"
            $activeTerm->display_sy = $activeTerm->year . '-' . ($activeTerm->year + 1);
        }
        
        // 3. Get Date Today
        $dateToday = Carbon::now()->format('F j, Y'); // "December 22, 2025"

        // 4. Pass to Frontend
        return Inertia::render('Admin/dashboard', [
            'activeTerm' => $activeTerm,
            'currentDate' => $dateToday,
            // 'notifications' => $notifications,
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
