<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Return the latest 10 notifications (testing only)
        // return $request->user()->notifications()->latest()->limit(10)->get();

        // TESTING NOTIFICATUION FOR THE ADMIN
        $notifications = Auth::user()->notifications()
            ->latest()
            ->paginate(15); // Initial load size
        
        return Inertia::render('Shared/notification', [
            'notifications' => $notifications,
        ]);
    }


    public function load(Request $request)
    {
        $perPage = 15; 
        $page = $request->input('page', 1); 

        $notifications = Auth::user()->notifications()
            ->latest()
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $notifications->items(),
            'next_page_url' => $notifications->nextPageUrl(),
            'has_more' => $notifications->hasMorePages(),
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function toggleRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        if ($notification->read()) {
            $notification->markAsUnread();
        } else {
            $notification->markAsRead();
        }

        return back()->with('success', 'success operation');
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
