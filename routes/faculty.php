<?php

use App\Http\Controllers\Faculty\Joint1\DefenseManagement;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
FACULTY ROUTES (NON-ADMIN SIDE)
==================================================================================
- Expected Roles: "ADVISER", "PANEL", "COORDINATOR", "COMMITTEE", "AWARDEE"
*/
Route::prefix('faculty')->group(function () {
    Route::middleware(['auth', 'role:faculty'])->group(function () {

        Route::get('dashboard', function () {
            return Inertia::render('Faculty/dashboard');
        })->name('faculty.dashboard');

        require __DIR__.'/faculty/adviser.php';
        require __DIR__.'/faculty/panel.php';

        // --- ADVISER + PANEL JOINT ROUTES ---
        // TEMPORARY, NOT YET FINALIZED (might be transferred to a shared file soon)
        Route::middleware('faculty.role:Panelist,Adviser')->group(function () {
            Route::get('defense-management',        [DefenseManagement::class, 'index'])->name('faculty.joint.defense_management.index');
            Route::patch('defense-management/{id}', [DefenseManagement::class, 'update'])->name('faculty.joint.defense_management.update');
        });

        require __DIR__.'/faculty/coordinator.php';
        require __DIR__.'/faculty/committee.php';
        require __DIR__.'/faculty/awardee.php';
    });
});
