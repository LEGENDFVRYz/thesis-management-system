<?php

namespace App\Http\Controllers\Faculty\Coordinator\ThesisMonitoring;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThesisRegistry extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 1.5: Trisha 

        // Check for filters

        // Main Query   --note: query also the details of defense in the modal in figma

        // Render and send props
        return Inertia::render('Faculty/management/coordinator/thesis_monitoring/thesis_registry');
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
