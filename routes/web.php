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

    Route::get('/repository', function () {
        return Inertia::render('Guest/repository');
    })->name('guest.repository');

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
Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Student/dashboard'); // Your Student Dashboard Component
    })->name('dashboard');

    Route::get('notification', function () {
        return Inertia::render('Shared/notification');
    })->name('student.notification');

    // Backend Preapered
    Route::prefix('management')->group(function () {
        Route::redirect('/', '/dashboard')->name('student.management.index'); 

        // Thesis Management
        Route::get('thesis', function () {
            return Inertia::render('Student/management/thesis');
        })->name('student.management.thesis');

        // Defense Management
        Route::get('defense_matrix', [MatrixController::class, 'index'])
            ->name('student.management.defense_matrix');

        // Compliance and IP Module
        Route::get('compliance_ip', function () {
            return Inertia::render('Student/management/compliance_ip');
        })->name('student.management.compliance_ip');

        // Progress Tracking
        Route::prefix('progress_tracking')->group(function () {
            
            // Default Route: Redirect to Overall Progress
            Route::get('/', function () {
                return redirect()->route('student.management.progress_tracking.overall_progress');
            });

            // Overall Progress
            Route::get('overall_progress', function () {
                return Inertia::render('Student/management/progress_tracking/overall_progress');
            })->name('student.management.progress_tracking.overall_progress');

            // Status Reports
            Route::get('status_reports', [ProgressController::class, 'statusReports'])
                ->name('student.management.progress_tracking.status_reports');

        });

        // Defense Evaluation
        Route::get('eval_n_grading', [EvaluationController::class, 'index'])
            ->name('student.management.eval_n_grading');

    });

    // FRONTEND READY
    Route::get('student/thesis-management', function () {
        return Inertia::render('Student/thesis-management/thesis');
    })->name('student.thesis-management');

    Route::get('student/ip-plagiarism', function () {
        return Inertia::render('Student/compliance and ip/compliance-ip');
    })->name('student.compliance_ip');

    Route::get('student/public-presentation', function () {
        return Inertia::render('Student/compliance and ip/public-presentation');
    })->name('student.public_presentation');

    Route::get('student/progress', function () {
        return Inertia::render('Student/progress-tracking/progress');
    })->name('student.progress');

    Route::get('student/defense', function () {
        return Inertia::render('Student/defense');
    })->name('student.defense');

    Route::get('student/profilemanagement', function () {
        return Inertia::render('Student/profilemanagement');
    })->name('student.profilemanagement');
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
            Route::redirect('/', '/faculty/dashboard')->name('faculty.management.index');   // temporary


            // --- ADVISER ROUTES ---
            Route::middleware('faculty.role:Adviser')->prefix('adviser')->group(function () {

                // Grouped "Advisee Management" tab
                Route::prefix('advisee_management')->group(function () {
                    Route::redirect('/', 'advisee_management/my_advisees')->name('faculty.management.adviser.advisee_management.index');   // temporary

                    Route::get('/my_advisees', [MyAdvisees::class, 'index'])->name('faculty.management.adviser.advisee_management.my_advisees');

                    Route::get('/group_comp', [GroupComp::class, 'index'])->name('faculty.management.adviser.advisee_management.group_comp');

                    Route::get('/thesis_review', [ThesisReview::class, 'index'])->name('faculty.management.adviser.advisee_management.thesis_review');

                    Route::get('/progress', [ProgressReport::class, 'index'])->name('faculty.management.adviser.advisee_management.progress');
                });

                // DEFENSE MANAGEMENT OF ADVISER HAS BEEN JOINED WITH PANEL
                // CHECK THE SPECIAL ROUTES FOR THIS SCENARIO...

                Route::get('endorsement', [Endorsement::class, 'index'])->name('faculty.management.adviser.endorsement');

                Route::get('eval_n_grading', [EvaluationGrading::class, 'index'])->name('faculty.management.adviser.eval_n_grading');

                // Evaluation and Grading's sub-pages (Document Review & Evaluation Tabs)
                Route::prefix('eval_n_grading')->group(function () {
                    
                    Route::get('document_review/{id}', [EvaluationGrading::class, 'showDocumentReview'])
                        ->name('faculty.adviser.document_review');

                    Route::get('evaluation/{id}', [EvaluationGrading::class, 'showEvaluation'])
                        ->name('faculty.adviser.evaluation');

                    Route::post('store', [EvaluationGrading::class, 'store'])
                        ->name('faculty.adviser.evaluation.store');
                        
                });

            });


            // --- PANEL ROUTES ---
            Route::middleware('faculty.role:Panelist')->prefix('panel')->group(function () {
                Route::get('thesis_review', function () {
                    return Inertia::render('Faculty/management/panel/thesis_review');
                })->name('faculty.management.panel.thesis_review');

                Route::get('thesis-review-0/thesis_review', function () {
                    return Inertia::render('Faculty/management/panel/thesis-review-0/thesis_review');
                })->name('faculty.management.panel.thesis_review_0.thesis_review');

                Route::get('thesis-review-0/docu_n_eval', function () {
                    return Inertia::render('Faculty/management/panel/thesis-review-0/docu_n_eval');
                })->name('faculty.management.panel.thesis_review_0.docu_n_eval');

                // DEFENSE MANAGEMENT OF PANEL HAS BEEN JOINED WITH ADVISER
                // CHECK THE SPECIAL ROUTES FOR THIS SCENARIO...
            });


            // --- SPECIAL ROUTES (ADVISER AND PANEL JOINT) ---
            Route::middleware('faculty.role:Panelist,Adviser')->group(function () {
                Route::get('defense_management', [DefenseManagement::class, 'index'])->name('faculty.management.joint.defense_management');
            });


            // --- AWARD COMMITTEE ROUTES ---
            Route::middleware('faculty.role:Awardee')->prefix('award_committee')->group(function () {
                Route::get('awards_evaluation', function () {
                    return Inertia::render('Faculty/management/award_committee/awards_evaluation');
                })->name('faculty.management.award.awards_evaluation');
            });


            // --- COMMITTEE ROUTES ---
            Route::middleware('faculty.role:Committee')->prefix('committee')->group(function () {
                Route::get('proposal_review', [ProposalReview::class, 'index'])->name('faculty.management.committee.proposal_review');
                Route::post('proposal_review', [ProposalReview::class, 'store'])->name('faculty.management.committee.proposal_review.store');
            });


            // --- COORDINATOR ROUTES ---
            Route::middleware('faculty.role:Coordinator')->prefix('coordinator')->group(function () {
                Route::get('compliance', function () {
                    return Inertia::render('Faculty/management/coordinator/compliance');
                })->name('faculty.management.coordinator.compliance');

                Route::get('communication', [Communication::class, 'create'])->name('faculty.management.coordinator.communication');

                // Grouped "Defense Management" tab
                Route::prefix('defense_management')->group(function () {
                    Route::redirect('/', 'defense_management/matrix')->name('faculty.management.coordinator.defense_management.index');   // temporary

                    Route::get('/matrix', [Matrix::class, 'index'])->name('faculty.management.coordinator.defense_management.matrix');

                    Route::get('/panel_assign', [PanelAssign::class, 'index'])->name('faculty.management.coordinator.defense_management.panel_assign');
                });

                // Grouped "Thesis Monitoring" tab
                Route::prefix('thesis_monitoring')->group(function () {
                    Route::redirect('/', 'thesis_monitoring/thesis_registry')->name('faculty.management.coordinator.thesis_monitoring.index');   // temporary

                    Route::get('/thesis_registry', [ThesisRegistry::class, 'index'])->name('faculty.management.coordinator.thesis_monitoring.thesis_registry');

                    Route::get('/progress', function () {
                        return Inertia::render('Faculty/management/coordinator/thesis_monitoring/progress');
                    })->name('faculty.management.coordinator.thesis_monitoring.progress');
                });

                Route::get('grading_management', function () {
                    return Inertia::render('Faculty/management/coordinator/grading_management');
                })->name('faculty.management.coordinator.grading_management');
            });
        });


        Route::get('resources', [ResourceController::class, 'index'])->name('faculty.resources');

        Route::get('notification', function () {
            return Inertia::render('Shared/notification');
        })->name('faculty.notification');

        Route::get('profilemanagement', function () {
            return Inertia::render('Shared/profilemanagement'); 
        })->name('faculty.profilemanagement');

        // Route::get('repository', function () {
        //     return Inertia::render('Shared/repository/thesis');
        // })->name('faculty.repository');
    });
});



/*
==================================================================================
FACULTY ROUTES      (ADMIN SIDE)

Note: Temporary Routes only for frontend, but soon will have own controller dependent on the purpose
==================================================================================
*/
Route::middleware(['auth', 'role:faculty', 'faculty.admin'])->prefix('admin')->group(function () {

    // Old Dashboard Route
    // Route::get('/', function () {
    //     return Inertia::render('Admin/dashboard');
    // })->name('admin.dashboard');

    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Management Routes
    Route::prefix('management')->group(function () {
        Route::redirect('/', 'management/student')->name('admin.management.index');     // dont know ehere is the default, so ayan nalang muna

        Route::get('student', [StudentController::class, 'index'])->name('admin.management.student');
        Route::post('student/store', [StudentController::class, 'store'])->name('admin.management.student.store');

        Route::get('faculty', [FacultyController::class, 'index'])->name('admin.management.faculty');

        Route::get('academic-settings', [AcademicSettingController::class, 'index'])->name('admin.management.academic');
        Route::put('academic-settings', [AcademicSettingController::class, 'update'])->name('admin.management.academic.update');

        Route::get('deadline', [DeadlineController::class, 'index'])->name('admin.management.deadline');
        Route::put('deadline/{id}', [DeadlineController::class, 'update'])->name('admin.management.deadline.update');


        // FULL CRUD OPERATIONS EXAMPLES
        Route::get('dept-policies', [DepartmentPoliciesController::class, 'index'])->name('admin.management.dep-policies');
        // Route::get('dept-policies/grading-criteria/{id}/edit', [DepartmentPoliciesController::class, 'edit'])->name('admin.management.dep-policies.edit');
        Route::put('dept-policies/grading-criteria/{id}', [DepartmentPoliciesController::class, 'update'])->name('admin.management.dep-policies.update');
        Route::delete('dept-policies/grading-criteria/{id}', [DepartmentPoliciesController::class, 'destroy'])->name('admin.management.dep-policies.destroy');
        Route::post('dept-policies/grading-criteria', [DepartmentPoliciesController::class, 'store'])->name('admin.management.dep-policies.store');

        Route::get('dept-policies/guidelines', [DepartmentPoliciesController::class, 'index2'])->name('admin.management.dep-policies.guidelines');
        Route::post('dept-policies/update-guidelines', [DepartmentPoliciesController::class, 'updateGuidelines'])->name('admin.management.dep-policies.update-guidelines');

        Route::get('defenses', [DefenseController::class, 'index'])->name('admin.management.defenses');
    });

    // Repository Routes
    Route::prefix('repository')->group(function () {
        Route::redirect('/', 'repository/thesis')->name('admin.repository.index');

        // Route::get('thesis', function () {
        //     return Inertia::render('Shared/repository/thesis');
        // })->name('admin.repository.theses');

        Route::get('resources', function () {
            return Inertia::render('Admin/repository/system');
        })->name('admin.repository.system');

        Route::get('system-expanded', function () {
            return Inertia::render('Admin/repository/system-expanded');
        })->name('admin.repository.system-expanded');
    });

    Route::get('resources', [ResourceController::class, 'index'])->name('admin.resources');
    Route::post('resources', [ResourceController::class, 'store'])->name('admin.resources.store');
    Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])->name('admin.resources.remove');
    Route::patch('resources/{resource}/toggle', [ResourceController::class, 'toggle'])->name('admin.resources.toggle');
    // Note: Download routes for resources is in public

    Route::get('notification', function () {
        return Inertia::render('Shared/notification');
    })->name('admin.notification');

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

Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');

// TEMPORARY: view shared thesis page without affecting guest/admin routes
Route::get('/test-thesis', function () {
    return Inertia::render('Shared/repository/thesis');
});

Route::get('/test-thesis-preview', function () {
    return Inertia::render('Shared/repository/document-preview', [
        'document' => [
            'title' => 'Sample Thesis',
            'url' => '/storage/sample.pdf'
        ]
    ]);
});

Route::get('/committee/proposal-review', function () {
    return Inertia::render('Committee/proposal-review');
});

require __DIR__.'/settings.php';