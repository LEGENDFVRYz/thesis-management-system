<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
AWARD COMMITTEE ROUTES
==================================================================================
*/
Route::middleware('faculty.role:Awardee')
    ->prefix('awardee')->as('faculty.awardee.')
    ->group(function () {

        // Awards Evaluation
        Route::get('evaluation', function () {
            return Inertia::render('Faculty/management/award_committee/awards_evaluation');
        })->name('evaluation');
    });
