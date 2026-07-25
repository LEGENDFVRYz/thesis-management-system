<?php

use App\Http\Controllers\FileImportController;
use App\Http\Controllers\PdfViewerController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;

/*
==================================================================================
API ROUTES 

**temporary only** — not under /api prefix, kept in the web routes
because they're consumed by Inertia pages rather than a standalone API client
==================================================================================
*/
Route::post('file-import',                  [FileImportController::class, 'store'])->name('file.import');
Route::get('/resources/{filekey}/download', [ResourceController::class, 'download'])->name('resources.download');
Route::get('/manuscripts/{id}/stream',      [PdfViewerController::class, 'streamPdf'])->name('manuscripts.stream');
