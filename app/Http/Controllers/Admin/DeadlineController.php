<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeadlineTemplate;
use App\Models\Event;
use App\Models\Milestone;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeadlineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get the active acdemic year and semester
        // Pull the active semestral recorc
        $active = Semester::with('schoolYear')
                                ->where('is_active', true)
                                ->first();

        // Get the value for active s.y. and sem
        $active_acad_year               = $active?->schoolYear?->year;
        $active_semestral               = $active?->semester;

        // Determine Which Stages are allowed for this Semester
        $allowed_stages = [];

        if ($active_semestral == 0) {
            $allowed_stages = [2];          // 1ST Semester: DP! Only
        } elseif ($active_semestral == 1) {
            $allowed_stages = [1, 3];       // 2ND Semester: MOR (thirdyear events) and DP2 (fourthyear event)
        }

        // MAIN QUERY: Get all the related events in the current semester
        $workflow_steps = Event::with('milestone') 
            ->where('semester_id', $active->id)
            ->whereHas('milestone', function ($query) use ($allowed_stages) {
                // Filter events where the filtered stages dependent on semester
                $query->whereIn('stage', $allowed_stages);
            })
            ->get()
            ->sortBy('milestone.sort_order')
            ->map(function ($event) {
                // Flatten the data for consumption
                return [
                    'event_id'   => $event->id,
                    'stage'      => $event->milestone->stage,
                    'sort_order' => $event->milestone->sort_order,
                    'name'       => $event->milestone->name,
                    'desc'       => $event->milestone->desc,
                    'start_date' => $event->start_date,
                    'offset'     => $event->milestone->offset,
                ];
            })
            ->toArray();

        // dd($workflow_steps);

        return Inertia::render('Admin/management/deadline', [
            'workflow' => $workflow_steps,
            'allowed_stages' => $allowed_stages,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
