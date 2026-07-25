<?php

use App\Http\Controllers\Faculty\Coordinator\Communication;
use App\Http\Controllers\Faculty\Coordinator\DefenseManagement\Matrix;
use App\Http\Controllers\Faculty\Coordinator\DefenseManagement\PanelAssign;
use App\Http\Controllers\Faculty\Coordinator\ThesisMonitoring\ThesisRegistry;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
COORDINATOR ROUTES
==================================================================================
*/
Route::middleware('faculty.role:Coordinator')
    ->prefix('coordinator')->as('faculty.coordinator.')
    ->group(function () {
        
        // Compliance
        Route::get('compliance', function () {
            return Inertia::render('Faculty/management/coordinator/compliance');
        })->name('compliance');

        // Communication
        Route::get('communication', [Communication::class, 'create'])->name('communication');

        // Defense Management
        Route::prefix('defense-management')->as('defense_management.')->group(function () {
            Route::redirect('/', 'defense_management/matrix')->name('index'); // temporary

            Route::get('matrix', [Matrix::class, 'index'])->name('matrix.index');

            Route::get('panel-assign',      [PanelAssign::class, 'index'])->name('panel_assign.index');
            Route::post('panel-assign',     [PanelAssign::class, 'store'])->name('panel_assign.store');
            Route::put('panel-assign/{id}', [PanelAssign::class, 'update'])->name('panel_assign.update');
        });

        // Thesis Monitoring
        Route::prefix('thesis')->as('thesis.')->group(function () {
            Route::redirect('/', 'thesis_monitoring/thesis_registry')->name('index'); // temporary

            Route::get('registry', [ThesisRegistry::class, 'index'])->name('registry');

            Route::get('progress', function () {
                return Inertia::render('Faculty/management/coordinator/thesis_monitoring/progress');
            })->name('progress');
        });

        // Grading Management
        Route::get('grade-management', function () {
            return Inertia::render('Faculty/management/coordinator/grading_management');
        })->name('grade_management');
    });
