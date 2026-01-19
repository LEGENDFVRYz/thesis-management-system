<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class GuestController extends Controller
{
    public function create(Request $request)
    {
        // Check if user already has guest_id or is authenticated
        if ($request->cookie('guest_id') || $request->user()) {
            return back()->with('error', "Guest already exists or user is logged in");
        }

        // create guest uuid
        $guestId = (string) Str::uuid();

        // issue a cookie
        $cookie = Cookie(
            'guest_id',
            (string) Str::uuid(),
            60 * 24 * 365 // 1 year
        );

        return back()
            ->with('success', "Guest {$guestId} login successfully!")
            ->withCookie($cookie);
    }
}
