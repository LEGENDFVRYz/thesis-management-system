<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Ensure user role exist, if not...
        if (! $request->user() || $request->user()->role !== $role) {
            
            // ...show 403 Forbidden error
            abort(403, 'Unauthorized. You do have (' . $role . ') role.');
        }
        
        return $next($request);
    }
}
