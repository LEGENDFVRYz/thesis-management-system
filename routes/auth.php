<?php

use App\Http\Controllers\Auth\FacultyLoginController;
use App\Http\Controllers\Auth\StudentLoginController;
use App\Http\Controllers\GuestController;
use Illuminate\Support\Facades\Route;

/*
==================================================================================
GUEST-ONLY ROUTES (login screens)
==================================================================================
*/
Route::middleware('guest')->group(function () {
    
    // Named 'login' (not 'student.login') because Fortify's own vendor code internally
    Route::get('login',     [StudentLoginController::class, 'create'])->name('login');
    Route::post('login',    [StudentLoginController::class, 'store'])->name('student.store');

    Route::get('/faculty/login',    [FacultyLoginController::class, 'create'])->name('faculty.login');
    Route::post('/faculty/login',   [FacultyLoginController::class, 'store'])->name('faculty.store');

    Route::post('/guest/login',     [GuestController::class, 'create'])->name('guest.login');
});


/*
==================================================================================
AUTHENTICATED LOGOUT ROUTES
==================================================================================
*/
Route::middleware('auth')->group(function () {

    // Named 'logout' (due to student login case) because Fortify's own vendor code internally
    Route::post('logout',           [StudentLoginController::class, 'destroy'])->name('student.logout');
    Route::post('faculty/logout',   [FacultyLoginController::class, 'destroy'])->name('faculty.logout');
});
