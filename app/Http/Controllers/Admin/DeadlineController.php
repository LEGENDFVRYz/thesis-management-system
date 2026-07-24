<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeadlineTemplate;
use App\Models\Event;
use App\Models\Milestone;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
                    'start_date' => $event->start_date?->format('Y-m-d'),
                    'offset'     => $event->milestone->offset,
                ];
            })
            ->toArray();

        return Inertia::render('Admin/management/deadline', [
            'workflow' => $workflow_steps,
            'allowed_stages' => $allowed_stages,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // VALIDATION: Input fields
        $validated = $request->validate([
            'event_id'   => 'required|exists:tbl_events,id',
            'start_date' => 'required|date',
        ]);

        // Fetch the target event
        $currentEvent = Event::with('milestone')->findOrFail($validated['event_id']);


        // VALIDATION: Sequencing of the events and overlapping
        if (!is_null($validated['start_date'])) {
            
            // Find the "Previous Event" (milestone with a lower sort_order) in the same semester
            $previousEvent = Event::query()
                ->where('semester_id', $currentEvent->semester_id)
                ->whereHas('milestone', function ($query) use ($currentEvent) {
                    $query->where('stage', $currentEvent->milestone->stage) // Stay within same stage? Usually safer to check whole workflow
                          ->where('sort_order', '<', $currentEvent->milestone->sort_order);
                })
                ->join('tbl_milestones', 'tbl_events.milestone_id', '=', 'tbl_milestones.id')
                ->orderByDesc('tbl_milestones.sort_order')
                ->select('tbl_events.*', 'tbl_milestones.offset')
                ->first();
            
            // Check if the previous event is "Unscheduled" (null startdate), we throw an error
            if ($previousEvent) {

                // Ensure previous event is scheduled
                $hasDates = !is_null($previousEvent->start_date) || !is_null($previousEvent->due_date);
                
                if (!$hasDates) {
                    // Fetch the dependednt milestone
                    $prevName = $previousEvent->milestone ? $previousEvent->milestone->name : 'Previous Step';
                    
                    return back()->withErrors([
                        '_error' => "Cannot schedule '{$currentEvent->milestone->name}' yet. Please set a date for '{$prevName}' first."
                    ]);
                }

                // Ensure no overlaps
                $prevStart  = $previousEvent->start_date;
                $prevEnd    = $prevStart->copy()->addDays($previousEvent->offset);

                if ($prevEnd) {
                    $newStart = Carbon::parse($validated['start_date']);

                    if ($newStart->lte($prevEnd)) {
                        return back()->withErrors([
                            '_error' =>
                                "Cannot start '{$currentEvent->milestone->name}' on {$newStart->toDateString()}. 
                                '{$previousEvent->milestone->name}' ends on {$prevEnd->toDateString()}."
                        ]);
                    }
                }
            }
        }

        // Update the Event
        $currentEvent->start_date = $validated['start_date'];
        $currentEvent->save();

        return back()->with('success', 'Event schedule updated successfully.');
    }
}
