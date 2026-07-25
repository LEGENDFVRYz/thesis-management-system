<?php

use App\Http\Controllers\Faculty\Committee\ProposalReview;
use Illuminate\Support\Facades\Route;

/*
==================================================================================
COMMITTEE ROUTES
==================================================================================
*/
Route::middleware('faculty.role:Committee')
    ->prefix('committee')->as('faculty.committee.')
    ->group(function () {

        // Proposal Review
        Route::get('proposal-review',   [ProposalReview::class, 'index'])->name('proposal_review.index');
        Route::post('proposal-review',  [ProposalReview::class, 'store'])->name('proposal_review.store');
    });
