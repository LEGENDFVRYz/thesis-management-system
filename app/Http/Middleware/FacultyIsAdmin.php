<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FacultyIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Check if faculty
        if (!$user || $user->role !== 'faculty') {
            abort(403, 'Access denied. Faculty credentials required.');
        }
        
        // Collect the faculty all subroles                     // next time we check if inactive or not
        // dd($user->faculty->roles->pluck('role_name'));

        // Check if the faculty has active admin access
        if (!$user->faculty || !$user->faculty->isAdmin()) {
            abort(403, 'Access denied. Administrative privileges required.');
        }

        return $next($request);
    }
}
