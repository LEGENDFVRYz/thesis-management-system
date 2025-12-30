<?php

namespace App\Http\Controllers\Faculty\Adviser;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class Endorsement extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 2.2: Arnel      --part 1/2
        
        // Query all the valid endorsement
        
        return Inertia::render('Faculty/management/adviser/endorsements');
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
        // TASK 2.2: Arnel      --part 2/2

        // Toggle the boolean marker for "is_adviser_approved" when approve 

        // SAved to DB
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
