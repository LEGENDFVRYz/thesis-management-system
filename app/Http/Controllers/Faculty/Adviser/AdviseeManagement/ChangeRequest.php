<?php

namespace App\Http\Controllers\Faculty\Adviser\AdviseeManagement;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ChangeRequest extends Controller
{
    public function index()
    {
        return Inertia::render('Faculty/management/adviser/advisee_management/change_request');
    }
}