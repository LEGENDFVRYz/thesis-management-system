<?php

use App\Http\Controllers\Shared\ThesisArchive;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
PUBLIC REPOSITORY / SEARCH ROUTES
==================================================================================
*/
Route::middleware('guestAuth')->group(function () {
    Route::get('/repository',               [ThesisArchive::class, 'index'])->name('guest.repository.index');
    Route::get('/repository/preview/{id}',  [ThesisArchive::class, 'show'])->name('guest.repository.preview');

    Route::get('/search', function () {
        return Inertia::render('Guest/filter-search');
    })->name('guest.search');

    Route::get('/preview/{id}', [ThesisArchive::class, 'show'])->name('guest.preview');
});
