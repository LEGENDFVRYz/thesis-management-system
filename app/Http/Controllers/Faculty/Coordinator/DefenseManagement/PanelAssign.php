<?php

namespace App\Http\Controllers\Faculty\Coordinator\DefenseManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PanelAssign extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 4.1: Maryel       --part 1/3
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Main Query 1: Query all the valid available panels that active in the academic semester  

        // Main Query 2: Query all the endorse thesis 

        // Render and Props
        return Inertia::render('Faculty/management/coordinator/defense_management/panel_assign');
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
        // TASK 4.1: Maryel       --part 2/3
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Used the testing modal to create a group and get all need information
        
        // Saved all the 3 panels selected in the tbl_endorse_panels
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
        // TASK 4.1: Maryel       --part 3/3
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Same logic to create but you should update change data only
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
