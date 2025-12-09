<?php

use App\Http\Controllers\Auth\FacultyLoginController;
use App\Http\Controllers\Auth\StudentLoginController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;



/*
==================================================================================
WEB STATIC ROUTES       (global routes)
==================================================================================
*/
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => false,
    ]);
})->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     // Acts as a gateway for each main role     (temporary, soon will have merge gateway controller)
//     Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
// });


/*
==================================================================================
STUDENT ROUTES 
==================================================================================
*/
Route::get('login', [StudentLoginController::class, 'create'])->name('student.login');
Route::post('login', [StudentLoginController::class, 'store'])->name('student.store');
Route::post('logout', [StudentLoginController::class, 'destroy'])->name('student.logout');

// AUTHENTICATED STUDENT ROUTES
Route::middleware(['auth', 'role:student'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Student/dashboard'); // Your Student Dashboard Component
    })->name('dashboard');
});



/*
==================================================================================
FACULTY ROUTES      (NON-ADMIN SIDE)
==================================================================================
- Expected Roles: "ADVISER", "PANEL", "COORDINATOR"

*/
Route::prefix('faculty')->group(function () {
    // PUBLIC FACULTY ROUTES
    Route::get('login', [FacultyLoginController::class, 'create'])->name('faculty.login');
    Route::post('login', [FacultyLoginController::class, 'store'])->name('faculty.store');
    Route::post('logout', [FacultyLoginController::class, 'destroy'])->name('faculty.logout');

    // AUTHENTICATED FACULTY ROUTES
    Route::middleware(['auth', 'role:faculty'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('Faculty/dashboard');
        })->name('faculty.dashboard');

    });
});



/*
==================================================================================
FACULTY ROUTES      (ADMIN SIDE)
==================================================================================
*/
Route::middleware(['auth', 'role:faculty', 'faculty.admin'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin/dashboard');
    })->name('admin.dashboard');
});



/*
==================================================================================
API ROUTES (temporary only)        
==================================================================================
*/




require __DIR__.'/settings.php';
