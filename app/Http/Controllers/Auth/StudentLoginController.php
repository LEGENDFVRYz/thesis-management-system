<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\StudentLoginRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;


class StudentLoginController extends Controller
{
    // Show the login page.
    public function create(): Response
    {
        return Inertia::render('auth/student/login', [
            'status' => session('status'),
            'loginType' => 'student',
        ]);
    }


    // Handle an incoming authentication request.
    public function store(StudentLoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }


    // Destroy an authenticated session.
    public function destroy(Request $request): RedirectResponse
    {
        $referer = $request->headers->get('referer');   // path caller

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Check if contained '/faculty'
        if ($referer && str_contains($referer, '/faculty')) {
            return redirect()->route('faculty.login');
        }
        return redirect()->route('student.login');
    }
}