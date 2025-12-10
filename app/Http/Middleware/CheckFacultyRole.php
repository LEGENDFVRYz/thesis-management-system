<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckFacultyRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $faculty_role): Response
    {
        $user = Auth::user();

        if (Auth::check()) {
            // safety net (just to make sure, even we have middleware for it)
            if ($user->role !== 'faculty') {
                abort(403, 'Access denied. Faculty credentials required.');
            }

            // dd($user->faculty->roles->pluck('role_name')->toArray());
            $user_faculty_roles = $user->faculty->roles->pluck('role_name')->toArray();

            if (!in_array($faculty_role, $user_faculty_roles)) {
                
                // ...show 403 Forbidden error
                abort(403, 'Unauthorized. You do have Faculty (' . $faculty_role . ') role.');
            }
        }

        return $next($request);
    }
}
