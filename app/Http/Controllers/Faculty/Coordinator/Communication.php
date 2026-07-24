<?php

namespace App\Http\Controllers\Faculty\Coordinator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class Communication extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // TASK 3.2: Timo       --part 1/2

        // Form Handling

        return Inertia::render('Faculty/management/coordinator/communication');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // TASK 3.2: Timo       --part 2/2
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Used the request from the form provided

        // Saved it into the database

    }
}
