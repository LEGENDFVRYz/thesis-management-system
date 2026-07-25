<?php

use App\Http\Controllers\Admin\AcademicSettingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DeadlineController;
use App\Http\Controllers\Admin\DefenseController;
use App\Http\Controllers\Admin\DepartmentPoliciesController;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
ADMIN ROUTES

Note: Admin pages are still on the faculty side by default (switch is in the
navigation).
==================================================================================
*/
Route::middleware(['auth', 'role:faculty', 'faculty.admin'])->prefix('admin')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Management Routes
    Route::prefix('management')->group(function () {
        Route::redirect('/', 'management/student')->name('admin.management.index');

        Route::get('student',        [StudentController::class, 'index'])->name('admin.management.student');
        Route::post('student/store', [StudentController::class, 'store'])->name('admin.management.student.store');

        Route::get('faculty',       [FacultyController::class, 'index'])->name('admin.management.faculty');
        Route::post('faculty',      [FacultyController::class, 'store'])->name('admin.management.faculty.store');
        Route::put('faculty/{id}',  [FacultyController::class, 'update'])->name('admin.management.faculty.update');

        Route::get('academic-settings', [AcademicSettingController::class, 'index'])->name('admin.management.academic');
        Route::put('academic-settings', [AcademicSettingController::class, 'update'])->name('admin.management.academic.update');

        Route::get('deadline',      [DeadlineController::class, 'index'])->name('admin.management.deadline');
        Route::put('deadline/{id}', [DeadlineController::class, 'update'])->name('admin.management.deadline.update');

        // Department Policies Routes
        Route::prefix('policies')->group(function () {
            Route::redirect('/', 'policies/system')->name('admin.management.policies.index');

            Route::get('/system',    [DepartmentPoliciesController::class, 'system'])->name('admin.management.policies.system');
            Route::get('/workflow',  [DepartmentPoliciesController::class, 'workflow'])->name('admin.management.policies.workflow');
            Route::get('/documents', [DepartmentPoliciesController::class, 'documents'])->name('admin.management.policies.documents');
            Route::get('/grading',   [DepartmentPoliciesController::class, 'grading'])->name('admin.management.policies.grading');
            
            // TODO: wire up once grading policy CRUD ships
            // Route::post('/grading', [DepartmentPoliciesController::class, 'storeGrading'])->name('admin.management.policies.store');
            // Route::put('/grading/{id}', [DepartmentPoliciesController::class, 'updateGrading'])->name('admin.management.policies.update');
            // Route::delete('/grading/{id}', [DepartmentPoliciesController::class, 'destroyGrading'])->name('admin.management.policies.destroy');

            Route::get('/guidelines',   [DepartmentPoliciesController::class, 'guidelines'])->name('admin.management.policies.guidelines');
            Route::post('/guidelines',  [DepartmentPoliciesController::class, 'updateGuidelines'])->name('admin.management.policies.guidelines.update');
        });

        Route::get('defense-monitoring', [DefenseController::class, 'index'])->name('admin.management.defenses');
    });

    // Repository Routes
    Route::prefix('repository')->group(function () {
        Route::redirect('/', 'repository/thesis')->name('admin.repository.index');

        Route::get('system-repository', function () {
            return Inertia::render('Admin/repository/system');
        })->name('admin.repository.system');

        Route::get('system-expanded', function () {
            return Inertia::render('Admin/repository/system-expanded');
        })->name('admin.repository.system-expanded');
    });

    // Resources Routes
    Route::post('resources',                    [ResourceController::class, 'store'])->name('admin.resources.store');
    Route::delete('resources/{resource}',       [ResourceController::class, 'destroy'])->name('admin.resources.remove');
    Route::patch('resources/{resource}/toggle', [ResourceController::class, 'toggle'])->name('admin.resources.toggle');
});
