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
Route::middleware('gues')->group(function () {
    Route::get('login', [StudentLoginController::class, 'create'])->name('student.login');
    Route::post('login', [StudentLoginController::class, 'store'])->name('student.store');
});
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
    Route::middleware('gues')->group(function () {
        Route::get('login', [FacultyLoginController::class, 'create'])->middleware('gues')->name('faculty.login');
        Route::post('login', [FacultyLoginController::class, 'store'])->name('faculty.store');
    });
    Route::post('logout', [FacultyLoginController::class, 'destroy'])->name('faculty.logout');  // can be removed

    // AUTHENTICATED FACULTY ROUTES
    Route::middleware(['auth', 'role:faculty'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('Faculty/dashboard');
        })->name('faculty.dashboard');

        // MANAGEMENT ROUTING DEPENDENT ON SUBROLES
        Route::prefix('management')->group(function () {
            Route::get('/', function () {
                return Inertia::render('Faculty/management/index');
            })->name('faculty.management.index');



            // PROTECTED ROUTES VIA FACULTY ROLES

            // Adviser Route
            Route::middleware('faculty.role:Adviser')->group(function () {
                Route::get('advisee_management', function () {
                    return Inertia::render('Faculty/management/adviser/advisee_management');
                })->name('faculty.management.advisee_management');
            });

            // Award Committee Route
            Route::middleware('faculty.role:Awardee')->group(function () {
                Route::get('awards_evaluation', function () {
                    return Inertia::render('Faculty/management/award_committee/awards_evaluation');
                })->name('faculty.management.awards_evaluation');
            });

            // Committee Route
            Route::middleware('faculty.role:Committee')->group(function () {
                Route::get('proposal_review', function () {
                    return Inertia::render('Faculty/management/committee/proposal_review');
                })->name('faculty.management.proposal_review');
            });

            // Coordinator Route
            Route::middleware('faculty.role:Coordinator')->group(function () {
                Route::get('thesis_monitoring', function () {
                    return Inertia::render('Faculty/management/coordinator/thesis_monitoring');
                })->name('faculty.management.thesis_monitoring');
            });

            // Panel Route
            Route::middleware('faculty.role:Panelist')->group(function () {
                Route::get('thesis_review', function () {
                    return Inertia::render('Faculty/management/panel/thesis_review');
                })->name('faculty.management.thesis_review');
            });
        });



        Route::get('resources', function () {
            return Inertia::render('Shared/resources');
        })->name('faculty.resources');

        Route::get('repository', function () {
            return Inertia::render('Shared/repository/thesis');
        })->name('faculty.repository');
    });
});



/*
==================================================================================
FACULTY ROUTES      (ADMIN SIDE)

Note: Temporary Routes only for frontend, but soon will have own controller dependent on the purpose
==================================================================================
*/
Route::middleware(['auth', 'role:faculty', 'faculty.admin'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin/dashboard');
    })->name('admin.dashboard');

    // Management Routes
    Route::prefix('management')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/management/index');
        })->name('admin.management.index');

        Route::get('system', function () {
            return Inertia::render('Admin/management/system');
        })->name('admin.management.system');
        
        Route::get('defenses', function () {
            return Inertia::render('Admin/management/defense');
        })->name('admin.management.defenses');

        Route::get('user', function () {
            return Inertia::render('Admin/management/user');
        })->name('admin.management.user');
    });

    Route::get('system', function () {
        return Inertia::render('Admin/system');
    })->name('admin.system');

    // Repository Routes
    Route::prefix('repository')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Shared/repository/index');
        })->name('admin.repository.index');

        Route::get('theses', function () {
            return Inertia::render('Shared/repository/thesis');
        })->name('admin.repository.theses');

        Route::get('resources', function () {
            return Inertia::render('Admin/repository/system');
        })->name('admin.repository.system');
    });

    Route::get('resources', function () {
        return Inertia::render('Shared/resources');
    })->name('admin.resources');
});



/*
==================================================================================
API ROUTES (temporary only)        
==================================================================================
*/




require __DIR__.'/settings.php';
