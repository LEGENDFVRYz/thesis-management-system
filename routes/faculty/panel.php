<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
PANEL ROUTES

- NOTE: Defense Management for the panel role is joined with the adviser role
==================================================================================
*/
Route::middleware('faculty.role:Panelist')
    ->prefix('panel')->as('faculty.panel.')
    ->group(function () {

        // Thesis Review (temporary only, subject to merge in the shared routes)
        Route::get('evaluation', function () {
            return Inertia::render('Faculty/management/panel/thesis_review');
        })->name('evaluation.index');

        Route::get('evaluation/document-review', function () {
            return Inertia::render('Faculty/management/panel/thesis-review-0/thesis_review');
        })->name('evaluation.document_review');

        Route::get('evaluation/grading', function () {
            return Inertia::render('Faculty/management/panel/thesis-review-0/docu_n_eval');
        })->name('evaluation.grading');
    });
