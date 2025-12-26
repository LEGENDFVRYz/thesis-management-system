<?php

namespace App\Http\Controllers\Faculty\Joint1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DefenseManagement extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 4.3: Maryel     --part 1/2

        // Check the filter requests

        // Main Query: check the figma and task description
        // note: query also the view modal details, especially assigned panel in tbl_endorsement_panels

        // Main Query 2: All Accepted Requests will be displayed for the “Calendar View” Button

        // Render and send the 2 props
        return Inertia::render('Faculty/management/adviser/defense_management');
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
        // TASK 4.3: Maryel     --part 2/2
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Validate if the login faculty user and the panel accept/reject request is the same, if not: invalid operation
        // note: Boolean marker for "is_confirmed" for approve/reject representation in panel request
        // note: Null is default for "is_confirmed" is pending...

        // Saved the update into the database
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
