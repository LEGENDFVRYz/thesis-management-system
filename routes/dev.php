<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
==================================================================================
DEV / COMPONENT SHOWCASE ROUTES (not for production use)
==================================================================================
*/
Route::get('/ui-showcase', function () {
    return Inertia::render('ui-showcase');
})->name('ui-showcase');

Route::get('/components-showcase', function () {
    return Inertia::render('components-showcase');
})->name('components-showcase');

Route::get('/badges-icons-showcase', function () {
    return Inertia::render('badges-icons-showcase');
})->name('badges-icons-showcase');
