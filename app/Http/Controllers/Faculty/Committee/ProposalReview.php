<?php

namespace App\Http\Controllers\Faculty\Committee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProposalReview extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 1.4: Trisha     --part 1/2

        // check for filtes

        // Main Query -- note: makesure you query also the other committee approval status

        // Seperate data by "pending" "under" "evaluated"

        // Render and send props
        return Inertia::render('Faculty/management/committee/proposal_review');
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
        // TASK 1.4: Trisha     --part 2/2
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
