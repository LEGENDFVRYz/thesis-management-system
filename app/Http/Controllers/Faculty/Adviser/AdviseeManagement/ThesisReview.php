<?php

namespace App\Http\Controllers\Faculty\Adviser\AdviseeManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThesisReview extends Controller
{
    /**
     * Display the groups list page.
     */
    public function index()
    {
        return Inertia::render('Faculty/management/adviser/advisee_management/thesis_review/index');
    }

    /**
     * Display the submissions list page for a specific group.
     */
    public function submissions($groupCode)
    {
        return Inertia::render('Faculty/management/adviser/advisee_management/thesis_review/submissions', [
            'groupCode' => $groupCode,
        ]);
    }

    /**
     * Display the document review page.
     */
    public function review($groupCode, $submissionId)
    {
        return Inertia::render('Faculty/management/adviser/advisee_management/thesis_review/review', [
            'groupCode' => $groupCode,
            'submissionId' => $submissionId,
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