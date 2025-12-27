<?php

namespace App\Http\Controllers\Faculty\Coordinator\DefenseManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('Faculty/management/coordinator/defense_management/matrix');
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
