<?php

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
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Acts as a gateway for each main role     (temporary, soon will have merge gateway controller)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});


/*
==================================================================================
STUDENT ROUTES 
==================================================================================
*/





/*
==================================================================================
FACULTY ROUTES      (admin-side)
==================================================================================
- Expected Roles: "ADVISER", "PANEL", "COORDINATOR"

*/





/*
==================================================================================
ADMIN ROUTES        (super-admin side)
==================================================================================

*/





/*
==================================================================================
API ROUTES (temporary only)        
==================================================================================
*/




require __DIR__.'/settings.php';
