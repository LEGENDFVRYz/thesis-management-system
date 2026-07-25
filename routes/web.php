<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

/*
==================================================================================
PUBLIC / STATIC ROUTES
==================================================================================
*/
Route::get('/',     [PageController::class, 'home'])->name('home');
Route::get('/faq',  [PageController::class, 'faq'])->name('faq');


/*
==================================================================================
ROUTE FILES
==================================================================================
*/
require __DIR__.'/guest.php';
require __DIR__.'/auth.php';
require __DIR__.'/student.php';
require __DIR__.'/faculty.php';
require __DIR__.'/admin.php';
require __DIR__.'/shared.php';
require __DIR__.'/settings.php';
require __DIR__.'/api.php';

if (app()->environment('local')) {
    require __DIR__.'/dev.php';
}
