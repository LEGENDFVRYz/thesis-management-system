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
        $notifications = Auth::user()->unreadNotifications->map(function ($n) {
            return [
                'id' => $n->id,
                // Accessing ->data here forces Laravel to cast the JSON string to an Array
                'data' => $n->data, 
                'read_at' => $n->read_at,
                'created_at' => $n->created_at,
                // specific to your previous frontend code needs:
                'type' => $n->type, 
            ];
        });

        return Inertia::render('Shared/notification', [
            'notifications' => $notifications,
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return back();
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
