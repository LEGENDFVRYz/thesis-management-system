<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
SHARED AUTHENTICATED ROUTES (student + faculty)
==================================================================================
*/
Route::middleware('auth')->group(function () {

    // ---- Resources Page ----
    Route::get('resources', [ResourceController::class, 'index'])->name('resources');

    // ---- Notification Routes ----
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/load', [NotificationController::class, 'load'])->name('notifications.load');
    Route::post('/notifications/{id}/toggle', [NotificationController::class, 'toggleRead'])->name('notifications.toggle');

    // ---- Profile (Settings) Management Routes ----
    Route::get('profilemanagement', function () {
        return Inertia::render('Shared/profilemanagement');
    })->name('admin.profilemanagement');
});
