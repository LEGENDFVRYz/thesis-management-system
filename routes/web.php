<?php

use App\Http\Controllers\Admin\DefenseController;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Auth\FacultyLoginController;
use App\Http\Controllers\Auth\StudentLoginController;
use App\Http\Controllers\FileImportController;
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


            // --- ADVISER ROUTES ---
            Route::middleware('faculty.role:Adviser')->prefix('adviser')->group(function () {
                Route::get('advisee_management', function () {
                    return Inertia::render('Faculty/management/adviser/advisee_management');
                })->name('faculty.management.adviser.advisee_management'); // Unique Name

                Route::get('defense_management', function () {
                    return Inertia::render('Faculty/management/adviser/defense_management');
                })->name('faculty.management.adviser.defense_management'); // Unique Name

                Route::get('endorsement', function () {
                    return Inertia::render('Faculty/management/adviser/endorsements');
                })->name('faculty.management.adviser.endorsement');

                Route::get('eval_n_grading', function () {
                    return Inertia::render('Faculty/management/adviser/eval_n_grading');
                })->name('faculty.management.adviser.eval_n_grading');
            });


            // --- AWARD COMMITTEE ROUTES ---
            Route::middleware('faculty.role:Awardee')->prefix('award_committee')->group(function () {
                Route::get('awards_evaluation', function () {
                    return Inertia::render('Faculty/management/award_committee/awards_evaluation');
                })->name('faculty.management.award.awards_evaluation');
            });


            // --- COMMITTEE ROUTES ---
            Route::middleware('faculty.role:Committee')->prefix('committee')->group(function () {
                Route::get('proposal_review', function () {
                    return Inertia::render('Faculty/management/committee/proposal_review');
                })->name('faculty.management.committee.proposal_review');
            });


            // --- COORDINATOR ROUTES ---
            Route::middleware('faculty.role:Coordinator')->prefix('coordinator')->group(function () {
                Route::get('defense_management', function () {
                    return Inertia::render('Faculty/management/coordinator/defense_management');
                })->name('faculty.management.coordinator.defense_management');
                
                Route::get('thesis_monitoring', function () {
                    return Inertia::render('Faculty/management/coordinator/thesis_monitoring');
                })->name('faculty.management.coordinator.thesis_monitoring');

                Route::get('compliance', function () {
                    return Inertia::render('Faculty/management/coordinator/compliance');
                })->name('faculty.management.coordinator.compliance');

                Route::get('communication', function () {
                    return Inertia::render('Faculty/management/coordinator/communication');
                })->name('faculty.management.coordinator.communication');

                Route::get('grading_management', function () {
                    return Inertia::render('Faculty/management/coordinator/grading_management');
                })->name('faculty.management.coordinator.grading_management');
            });


            // --- PANEL ROUTES ---
            Route::middleware('faculty.role:Panelist')->prefix('panel')->group(function () {
                Route::get('thesis_review', function () {
                    return Inertia::render('Faculty/management/panel/thesis_review');
                })->name('faculty.management.panel.thesis_review');
                
                Route::get('defense_management', function () {
                    return Inertia::render('Faculty/management/panel/defense_management');
                })->name('faculty.management.panel.defense_management'); 
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
        Route::redirect('/', 'management/student')->name('admin.management.index');     // dont know ehere is the default, so ayan nalang muna

        Route::get('student', [StudentController::class, 'index'])->name('admin.management.student');
        Route::post('student/store', [StudentController::class, 'store'])->name('admin.management.student.store');

        Route::get('faculty', [FacultyController::class, 'index'])->name('admin.management.faculty');

        Route::get('academic-settings', function () {
            return Inertia::render('Admin/management/academic');
        })->name('admin.management.academic');

        Route::get('deadline', function () {
            return Inertia::render('Admin/management/deadline');
        })->name('admin.management.deadline');

        Route::get('dept-policies', function () {
            return Inertia::render('Admin/management/dep-policies');
        })->name('admin.management.dep-policies');
        

        Route::get('defenses', [DefenseController::class, 'index'])->name('admin.management.defenses');

    });

    // Repository Routes
    Route::prefix('repository')->group(function () {
        Route::redirect('/', 'repository/thesis')->name('admin.repository.index');

        Route::get('thesis', function () {
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
Route::post('file-import', [FileImportController::class, 'store'])->name('file.import');



require __DIR__.'/settings.php';


// Buttons Development Route

Route::get('/buttondev', function () {
    return inertia('buttondev');
});