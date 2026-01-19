<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThesisManagementController extends Controller
{
    /**
     *  DOCUMENTS PAGE (Default)
     */
    public function documents()
    {
        
        return Inertia::render('Student/management/thesis-management/documents');
    }

    /**
     *  COMPARE PAGE
     */
    public function compare()
    {

        return Inertia::render('Student/management/thesis-management/compare');
    }

    /**
     *  WORKFLOW PAGE
     */
    public function workflow()
    {

        return Inertia::render('Student/management/thesis-management/workflow');
    }

    /**
     *  FINAL SUBMISSION PAGE
     */
    public function finalSubmission()
    {

        return Inertia::render('Student/management/thesis-management/final-submission');
    }

    /**
     *  CHANGE REQUEST PAGE
     */
    public function changeRequest()
    {

        return Inertia::render('Student/management/thesis-management/change-request');
    }
}
