<?php

use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\ChangeRequest;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\GroupComp;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\MyAdvisees;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\ProgressReport;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\ThesisReview;
use App\Http\Controllers\Faculty\Adviser\Endorsement;
use App\Http\Controllers\Faculty\Adviser\EvaluationGrading;
use Illuminate\Support\Facades\Route;

/*
==================================================================================
ADVISER ROUTES

- NOTE: Defense Management for the adviser role is joined with the panel role
==================================================================================
*/
Route::middleware('faculty.role:Adviser')
    ->prefix('adviser')->as('faculty.adviser.')
    ->group(function () {

        // Advisee Management - Advisees
        Route::get('advisees', [MyAdvisees::class, 'index'])->name('my_advisees.index');

        // Advisee Management - Groups
        Route::get('group-composition',         [GroupComp::class, 'index'])->name('group_comp.index');
        Route::post('group-composition',        [GroupComp::class, 'store'])->name('group_comp.store');
        Route::put('group-composition/{id}',    [GroupComp::class, 'update'])->name('group_comp.update');
        Route::delete('group-composition/{id}', [GroupComp::class, 'destroy'])->name('group_comp.destroy');

        // Advisee Management - Thesis Review
        Route::get('thesis-review',                            [ThesisReview::class, 'index'])->name('thesis_review.index');
        Route::get('thesis-review/{groupCode}',                [ThesisReview::class, 'submissions'])->name('thesis_review.submissions');
        Route::get('thesis-review/{groupCode}/{submissionId}', [ThesisReview::class, 'review'])->name('thesis_review.review');

        // Advisee Management - Progress
        Route::get('progress',  [ProgressReport::class, 'index'])->name('progress.index');

        // Advisee Management - Change Request
        Route::get('change-request', [ChangeRequest::class, 'index'])->name('change_request.index');

        // Endorsement
        Route::get('endorsement',       [Endorsement::class, 'index'])->name('endorsement.index');
        Route::put('endorsement/{id}',  [Endorsement::class, 'update'])->name('endorsement.update');

        // Evaluation and Grading (Document Review & Evaluation tabs)
        Route::get('evaluation',                        [EvaluationGrading::class, 'index'])->name('evaluation.index');
        Route::post('evaluation',                       [EvaluationGrading::class, 'store'])->name('evaluation.store');
        Route::get('evaluation/document_review/{id}',   [EvaluationGrading::class, 'showDocumentReview'])->name('evaluation.document_review');
        Route::get('evaluation/grading/{id}',           [EvaluationGrading::class, 'showEvaluation'])->name('evaluation.grading');
    });
