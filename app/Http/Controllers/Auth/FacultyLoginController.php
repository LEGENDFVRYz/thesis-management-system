<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Auth\FacultyLoginRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FacultyLoginController extends Controller
{
    // Show the login page.
    public function create(): Response
    {
        // login
        return Inertia::render('auth/faculty/login', [
            'status' => session('status'),
            'loginType' => 'faculty', 
        ]);
    }


    // Handle an incoming authentication request.
    public function store(FacultyLoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Add user session values here
        session([
            'faculty_id' => $user->faculty?->id,
            'is_admin' => $user->faculty?->isAdmin(),
        ]);

        return redirect()->intended(route('faculty.dashboard', absolute: false));
    }

    // Destroy an authenticated session.
    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/faculty/login');
    }
}