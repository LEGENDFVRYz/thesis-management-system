<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolYear;
use App\Models\Semester;
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
        $active_acad_year = $active?->schoolYear?->year;
        $active_semestral = $active?->semester;

        return Inertia::render('Admin/management/academic', [
            'active_sy'     => $active_acad_year,
            'active_sem'    => $active_semestral,
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
