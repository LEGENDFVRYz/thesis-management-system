<?php

use App\Http\Controllers\Admin\AcademicSettingController;
use App\Http\Controllers\Admin\DeadlineController;
use App\Http\Controllers\Admin\DefenseController;
use App\Http\Controllers\Admin\DepartmentPoliciesController;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Auth\FacultyLoginController;
use App\Http\Controllers\Auth\StudentLoginController;
use App\Http\Controllers\Faculty\Adviser\Endorsement;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\GroupComp;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\MyAdvisees;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\ProgressReport;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\ThesisReview;
use App\Http\Controllers\Faculty\Adviser\AdviseeManagement\ChangeRequest;
use App\Http\Controllers\Faculty\Adviser\EvaluationGrading;
use App\Http\Controllers\Faculty\Committee\ProposalReview;
use App\Http\Controllers\Faculty\Coordinator\Communication;
use App\Http\Controllers\Faculty\Coordinator\DefenseManagement\Matrix;
use App\Http\Controllers\Faculty\Coordinator\DefenseManagement\PanelAssign;
use App\Http\Controllers\Faculty\Coordinator\ThesisMonitoring\ThesisRegistry;
use App\Http\Controllers\Faculty\Joint1\DefenseManagement;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\FileImportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PdfViewerController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\Shared\ThesisArchive;
use App\Http\Controllers\Student\EvaluationController;
use App\Http\Controllers\Student\MatrixController;
use App\Http\Controllers\Student\ProgressController;
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

// UI Showcase (temporary - for testing components)
Route::get('/ui-showcase', function () {
    return Inertia::render('ui-showcase');
})->name('ui-showcase');

Route::get('/components-showcase', function () {
    return Inertia::render('components-showcase');
})->name('components-showcase');

Route::get('/badges-icons-showcase', function () {
    return Inertia::render('badges-icons-showcase');
})->name('badges-icons-showcase');

// FAQ Page
Route::get('/faq', function () {
    return Inertia::render('faq');
})->name('faq');

// Route::middleware(['auth', 'verified'])->group(function () {
//     // Acts as a gateway for each main role     (temporary, soon will have merge gateway controller)
//     Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
// });


// GUEST ROUTES
Route::prefix('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Guest/landing');
    })->name('guest.landing');

    Route::get('/repository', [ThesisArchive::class, 'index'])->name('guest.repository');
    Route::get('/repository/preview/{id}', [ThesisArchive::class, 'show'])->name('guest.repository.preview');

    Route::get('/search', function () {
        return Inertia::render('Guest/filter-search');
    })->name('guest.search');

    Route::get('/preview/{id}',  [ThesisArchive::class, 'show'])->name('guest.preview');
});

// PUBLIC ARCHIVE (legacy routes - redirect to guest)
Route::prefix('repository')->group(function () {
    Route::redirect('/', '/guest/repository')->name('repository.index');
    Route::redirect('thesis', '/guest/repository')->name('repository.theses');
});


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

    # Management Tabs
    Route::prefix('management')->group(function () {
        Route::redirect('/', '/dashboard')->name('student.management.index'); 

        # Thesis Management
        Route::get('thesis', function () {
            return Inertia::render('Student/management/thesis-management/thesis');
        })->name('student.management.thesis');

        # Defense Management
        Route::get('defense_matrix', [MatrixController::class, 'index'])->name('student.management.defense_matrix');

        # Evaluation Grading
        Route::get('evaluation', [EvaluationController::class, 'index'])->name('student.management.eval_n_grading');

        # Compliance and IP Module
        Route::prefix('compliance')->group(function () {

            Route::get('ip', function () {
                return Inertia::render('Student/management/compliance-and-ip/compliance-ip');
            })->name('student.management.compliance.ip');

            Route::get('presentation', function () {
                return Inertia::render('Student/management/compliance-and-ip/public-presentation');
            })->name('student.management.compliance.presentation');
        });

        # Progress Tracking
        Route::prefix('progress')->group(function () {
            
            Route::get('overall', function () {
                return Inertia::render('Student/management/progress_tracking/overall_progress');
            })->name('student.management.progress.overall');

            Route::get('reports', [ProgressController::class, 'statusReports'])
                ->name('student.management.progress.reports');
        });
    });
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


            // ====================================================================================================
            // --- ADVISER ROUTES ---
            // ====================================================================================================
            Route::middleware('faculty.role:Adviser')
                ->prefix('adviser')->as('faculty.adviser.')
                ->group(function () {
                
                # "Advisee Management" - ADVISEES
                Route::get('advisees', [MyAdvisees::class, 'index'])->name('my_advisees.index');
                
                # "Advisee Management" - GROUPS
                Route::get('group-composition', [GroupComp::class, 'index'])->name('group_comp.index');
                Route::post('group-composition', [GroupComp::class, 'store'])->name('group_comp.store');
                Route::put('group-composition/{id}', [GroupComp::class, 'update'])->name('group_comp.update');
                Route::delete('group-composition/{id}', [GroupComp::class, 'destroy'])->name('group_comp.destroy');
                
                # "Advisee Management" - THESIS REVIEW
                Route::get('thesis-review', [ThesisReview::class, 'index'])->name('thesis_review.index');
                
                # "Advisee Management" - PROGRESS
                Route::get('progress', [ProgressReport::class, 'index'])->name('progress.index');

                # "Advisee Management" - CHANGE REQUEST
                Route::get('change-request', [ChangeRequest::class, 'index'])->name('change_request.index');
                
                // ----------------------------------------------------------------------
                // NOTE: DEFENSE MANAGEMENT OF ADVISER HAS BEEN JOINED WITH PANEL
                // ----------------------------------------------------------------------
                
                
                # ENDORSEMENT
                Route::get('endorsement', [Endorsement::class, 'index'])->name('endorsement.index');
                Route::put('endorsement/{id}', [Endorsement::class, 'update'])->name('endorsement.update');

                # EVALUATION AND GRADING (Document Review & Evaluation Tabs)
                Route::get('evaluation', [EvaluationGrading::class, 'index'])->name('evaluation.index');
                Route::post('evaluation', [EvaluationGrading::class, 'store'])->name('evaluation.store');
                Route::get('evaluation/document_review/{id}', [EvaluationGrading::class, 'showDocumentReview'])->name('evaluation.document_review');
                Route::get('evaluation/grading/{id}', [EvaluationGrading::class, 'showEvaluation'])->name('evaluation.grading');

            });


            // ====================================================================================================
            // --- PANEL ROUTES ---
            // ====================================================================================================
            Route::middleware('faculty.role:Panelist')
                ->prefix('panel')->as('faculty.panel.')
                ->group(function () {

                # Thesis Review (Temporary onl;y, subject to merge in the shard routes)
                Route::get('evaluation', function () {
                    return Inertia::render('Faculty/management/panel/thesis_review');
                })->name('evaluation.index');

                Route::get('evaluation/document-review', function () {
                    return Inertia::render('Faculty/management/panel/thesis-review-0/thesis_review');
                })->name('evaluation.document_review');

                Route::get('evaluation/grading', function () {
                    return Inertia::render('Faculty/management/panel/thesis-review-0/docu_n_eval');
                })->name('evaluation.grading');

                // ----------------------------------------------------------------------
                // NOTE: DEFENSE MANAGEMENT OF ADVISER HAS BEEN JOINED WITH PANEL
                // ----------------------------------------------------------------------
            });


            // ====================================================================================================
            // --- SPECIAL ROUTES (ADVISER AND PANEL JOINT) ---
            // ====================================================================================================
            Route::middleware('faculty.role:Panelist,Adviser')->group(function () {
                # TEMPORARY NOT YET FINALIZED (might be transferred in shared soon)
                Route::get('defense-management', [DefenseManagement::class, 'index'])->name('faculty.joint.defense_management.index');
                Route::patch('defense-management/{id}', [DefenseManagement::class, 'update'])->name('faculty.joint.defense_management.update');
            });


            // ====================================================================================================
            // --- COORDINATOR ROUTES ---
            // ====================================================================================================
            Route::middleware('faculty.role:Coordinator')
                ->prefix('coordinator')->as('faculty.coordinator.')
                ->group(function () {

                # COMPLIANCE
                Route::get('compliance', function () {
                    return Inertia::render('Faculty/management/coordinator/compliance');
                })->name('compliance');

                # COMMUNICATION
                Route::get('communication', [Communication::class, 'create'])->name('communication');

                # DEFENSE MAANGEMENT
                Route::prefix('defense-management')->as('defense_management.')->group(function () {
                    Route::redirect('/', 'defense_management/matrix')->name('index');   // temporary

                    # Matrix
                    Route::get('matrix', [Matrix::class, 'index'])->name('matrix.index');

                    # Panel Assign
                    Route::get('panel-assign', [PanelAssign::class, 'index'])->name('panel_assign.index');
                    Route::post('panel-assign', [PanelAssign::class, 'store'])->name('panel_assign.store');
                    Route::put('panel-assign/{id}', [PanelAssign::class, 'update'])->name('panel_assign.update');
                });

                # THESIS MONITORING
                Route::prefix('thesis')->as('thesis.')->group(function () {
                    Route::redirect('/', 'thesis_monitoring/thesis_registry')->name('index');     // temporary

                    Route::get('registry', [ThesisRegistry::class, 'index'])->name('registry');

                    Route::get('progress', function () {
                        return Inertia::render('Faculty/management/coordinator/thesis_monitoring/progress');
                    })->name('progress');
                });

                # GRADING MANAGEMENT
                Route::get('grade-management', function () {
                    return Inertia::render('Faculty/management/coordinator/grading_management');
                })->name('grade_management');
            });


            // ====================================================================================================
            // --- COMMITTEE ROUTES ---
            // ====================================================================================================
            Route::middleware('faculty.role:Committee')
                ->prefix('committee')->as('faculty.committee.')
                ->group(function () {
                
                // Proposal Review
                Route::get('proposal-review', [ProposalReview::class, 'index'])->name('proposal_review.index');
                Route::post('proposal-review', [ProposalReview::class, 'store'])->name('proposal_review.store');
            });


            // ====================================================================================================
            // --- AWARD COMMITTEE ROUTES ---
            // ====================================================================================================
            Route::middleware('faculty.role:Awardee')
                ->prefix('awardee')->as('faculty.awardee.')
                ->group(function () {
                
                // Awards Evaluation
                Route::get('evaluation', function () {
                    return Inertia::render('Faculty/management/award_committee/awards_evaluation');
                })->name('evaluation');
            });

        Route::get('resources', [ResourceController::class, 'index'])->name('faculty.resources');
    });
});



/*
==================================================================================
ADMIN ROUTES      

Note: Pages of admin side are still in the faculty by default (switch is in the navigation) 
==================================================================================
*/
Route::middleware(['auth', 'role:faculty', 'faculty.admin'])->prefix('admin')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Management Routes
    Route::prefix('management')->group(function () {
        Route::redirect('/', 'management/student')->name('admin.management.index');     // dont know ehere is the default, so ayan nalang muna

        Route::get('student', [StudentController::class, 'index'])->name('admin.management.student');
        Route::post('student/store', [StudentController::class, 'store'])->name('admin.management.student.store');

        Route::get('faculty', [FacultyController::class, 'index'])->name('admin.management.faculty');
        Route::post('faculty', [FacultyController::class, 'store'])->name('admin.management.faculty.store');
        Route::put('faculty/{id}', [FacultyController::class, 'update'])->name('admin.management.faculty.update');

        Route::get('academic-settings', [AcademicSettingController::class, 'index'])->name('admin.management.academic');
        Route::put('academic-settings', [AcademicSettingController::class, 'update'])->name('admin.management.academic.update');

        Route::get('deadline', [DeadlineController::class, 'index'])->name('admin.management.deadline');
        Route::put('deadline/{id}', [DeadlineController::class, 'update'])->name('admin.management.deadline.update');

        // Department Policies Routes
        Route::prefix('policies')->group(function () {
            Route::redirect('/', 'policies/system')->name('admin.management.policies.index');

            // Route::get('policies', [DepartmentPoliciesController::class, 'index'])->name('admin.management.policies');

            Route::get('/system', [DepartmentPoliciesController::class, 'system'])->name('admin.management.policies.system');

            Route::get('/workflow', [DepartmentPoliciesController::class, 'workflow'])->name('admin.management.policies.workflow');

            Route::get('/documents', [DepartmentPoliciesController::class, 'documents'])->name('admin.management.policies.documents');

            Route::get('/grading', [DepartmentPoliciesController::class, 'grading'])->name('admin.management.policies.grading');
            // Route::post('/grading', [DepartmentPoliciesController::class, 'storeGrading'])->name('admin.management.policies.store');
            // Route::put('/grading/{id}', [DepartmentPoliciesController::class, 'updateGrading'])->name('admin.management.policies.update');
            // Route::delete('/grading/{id}', [DepartmentPoliciesController::class, 'destroyGrading'])->name('admin.management.policies.destroy');

            Route::get('/guidelines', [DepartmentPoliciesController::class, 'guidelines'])->name('admin.management.policies.guidelines');
            Route::post('/guidelines', [DepartmentPoliciesController::class, 'updateGuidelines'])->name('admin.management.policies.guidelines.update');
        });

        Route::get('defense-monitoring', [DefenseController::class, 'index'])->name('admin.management.defenses');
    });


    // Repository Routes
    Route::prefix('repository')->group(function () {
        Route::redirect('/', 'repository/thesis')->name('admin.repository.index');

        Route::get('resources', function () {
            return Inertia::render('Admin/repository/system');
        })->name('admin.repository.system');

        Route::get('system-expanded', function () {
            return Inertia::render('Admin/repository/system-expanded');
        })->name('admin.repository.system-expanded');
    });


    // Resources Routes
    Route::get('resources', [ResourceController::class, 'index'])->name('admin.resources');
    Route::post('resources', [ResourceController::class, 'store'])->name('admin.resources.store');
    Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])->name('admin.resources.remove');
    Route::patch('resources/{resource}/toggle', [ResourceController::class, 'toggle'])->name('admin.resources.toggle');
});



/*
==================================================================================
SHARED AUTH ROUTES      
==================================================================================
*/
Route::middleware(['auth'])->group(function() {

    // ---- Repository -----
    Route::get('/test-thesis', function () {
        return Inertia::render('Shared/repository/thesis');
    });

    Route::get('/test-thesis-preview', function () {
        // this one is temporary only, the routing wil be change soon
        return Inertia::render('Shared/repository/document-preview');
    });


    // ---- Notification Routes ----
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/load', [NotificationController::class, 'load'])->name('notifications.load');
    Route::post('/notifications/{id}/toggle', [NotificationController::class, 'toggleRead'])->name('notifications.toggle');
    

    // ---- Profile (Settings) Management Routes -----
    Route::get('profilemanagement', function () {
        return Inertia::render('Shared/profilemanagement'); 
    })->name('admin.profilemanagement');
});



/*
==================================================================================
API ROUTES (temporary only)
==================================================================================
*/
Route::post('file-import', [FileImportController::class, 'store'])->name('file.import');
Route::get('/resources/{filekey}/download', [ResourceController::class, 'download'])->name('resources.download');
Route::get('/manuscripts/{id}/stream', [PdfViewerController::class, 'streamPdf'])->name('manuscripts.stream');




require __DIR__.'/settings.php';