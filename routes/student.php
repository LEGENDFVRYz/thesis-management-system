<?php

use App\Http\Controllers\Student\EvaluationController;
use App\Http\Controllers\Student\MatrixController;
use App\Http\Controllers\Student\ProgressController;
use App\Http\Controllers\Student\ThesisManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
STUDENT ROUTES
==================================================================================
*/
Route::middleware(['auth', 'role:student'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Student/dashboard');
    })->name('dashboard');


    Route::prefix('management')->group(function () {
        Route::redirect('/', '/dashboard')->name('student.management.index');

        // Thesis Management (landing page)
        Route::get('thesis', function () {
            return Inertia::render('Student/management/thesis-management/thesis');
        })->name('student.management.thesis');

        Route::prefix('thesis')->name('student.thesis.')->group(function () {
            // 1. Documents (Default Page)
            Route::get('/documents',                [ThesisManagementController::class, 'documents'])->name('documents');
            Route::post('/documents/upload',        [ThesisManagementController::class, 'documentUpload'])->name('documents.upload');
            Route::get('/documents/download/{id}',  [ThesisManagementController::class, 'documentDownload'])->name('documents.download');
            Route::get('/documents/view/{id}',      [ThesisManagementController::class, 'documentView'])->name('documents.view');

            // 2. Compare
            Route::get('/compare',  [ThesisManagementController::class, 'compare'])->name('compare');

            // 3. Workflow
            Route::get('/workflow', [ThesisManagementController::class, 'workflow'])->name('workflow');

            // 4. Final Submission
            Route::get('/final-submission', [ThesisManagementController::class, 'finalSubmission'])->name('final.submission');

            // 5. Change Request
            Route::get('/change-request',   [ThesisManagementController::class, 'changeRequest'])->name('request');
        });

        // Defense Management
        Route::get('defense_matrix', [MatrixController::class, 'index'])->name('student.management.defense_matrix');

        // Evaluation Grading
        Route::get('evaluation',     [EvaluationController::class, 'index'])->name('student.management.eval_n_grading');

        // Compliance and IP Module
        Route::prefix('compliance')->group(function () {
            Route::get('ip', function () {
                return Inertia::render('Student/management/compliance-and-ip/compliance-ip');
            })->name('student.management.compliance.ip');

            Route::get('presentation', function () {
                return Inertia::render('Student/management/compliance-and-ip/public-presentation');
            })->name('student.management.compliance.presentation');
        });

        // Progress Tracking
        Route::prefix('progress')->group(function () {
            Route::get('overall', function () {
                return Inertia::render('Student/management/progress_tracking/overall_progress');
            })->name('student.management.progress.overall');

            Route::get('reports', [ProgressController::class, 'statusReports'])
                ->name('student.management.progress.reports');
        });
    });
});
