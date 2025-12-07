<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {
        $user = auth()->user();

        if ($user->role === 'student') {
            return Inertia::render('Student/dashboard');
            
        }

        if ($user->role === 'faculty') {
            return Inertia::render('Faculty/dashboard');
        }

        if ($user->role === 'admin') {
            return Inertia::render('Admin/dashboard');
        }

        abort(403);
    }
}
