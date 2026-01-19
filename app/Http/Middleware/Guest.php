<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Guest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Authenticated users always allowed
        if (auth()->check()) {
            return $next($request);
        }

        // Guests with a valid guest_id are allowed
        if ($request->cookie('guest_id')) {
            return $next($request);
        }

        // Everyone else is rejected
        return redirect()->route('home'); // or abort(403)
    }
}
