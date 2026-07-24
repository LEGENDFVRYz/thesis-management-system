<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Milestone;
use App\Models\Semester;
use App\Models\Submission;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ThesisManagementController extends Controller
{
    /**
     *  DOCUMENTS PAGE (Default)
     */
    public function documents()
    {
        $user = Auth::user();

        // 1. Group & Semester Context
        $group = $user->student->group()
            ->with('sectionAdviser.assignment.schoolYear')
            ->first();

        if (!$group) return back()->with('error', 'No thesis group assigned.');

        $activeSemester = Semester::with('schoolYear')->where('is_active', true)->first();
        if (!$activeSemester) return back()->with('error', 'No active semester.');

        // 2. Determine Current Stage (for the default tab selection)
        $groupStartYear = $group->sectionAdviser->assignment->schoolYear->year;
        $activeYear = $activeSemester->schoolYear->year;
        $yearLevel = 3 + ($activeYear - $groupStartYear);

        $currentStageKey = 'mor';
        if ($yearLevel >= 4) {
            $currentStageKey = Str::contains(Str::lower($activeSemester->name), ['1st', 'first']) ? 'dp1' : 'dp2';
        }

        // 3. Fetch Events (Sorted by Milestone Order)
        // We strictly use this to maintain the correct "Step 1, Step 2" order
        $events = Event::with('milestone')
            ->get()
            ->sortBy(fn($e) => $e->milestone->sort_order);

        // 4. Fetch Submissions (Grouped by Event ID)
        $submissions = Submission::where('group_id', $group->id)
            ->orderBy('submitted_at', 'desc') // Newest files on top
            ->get()
            ->groupBy('event_id');

        // 5. Build Response (Only populated buckets)
        $documentsByMilestone = [
            'mor' => [],
            'dp1' => [],
            'dp2' => []
        ];

        $statusMap = [0 => 'Pending', 1 => 'Approved', 2 => 'Rejected', 3 => 'For Revision'];
        $stageMap = [1 => 'mor', 2 => 'dp1', 3 => 'dp2'];

        foreach ($events as $event) {
            $stageId = $event->milestone->stage;
            
            // Skip if stage is unknown
            if (!isset($stageMap[$stageId])) continue;
            
            $key = $stageMap[$stageId];
            $eventSubmissions = $submissions->get($event->id);

            // ONLY add to list if submissions actually exist
            if ($eventSubmissions && $eventSubmissions->count() > 0) {
                foreach ($eventSubmissions as $sub) {
                    $documentsByMilestone[$key][] = [
                        'id'           => $sub->id,
                        'title'        => $sub->title,
                        'type'         => $sub->document_type,
                        'description'  => $sub->description,
                        'date'         => $sub->submitted_at->format('F d, Y'),
                        'status'       => $statusMap[$sub->status] ?? 'Unknown',
                        'is_submitted' => true,
                        'event_name'   => $event->milestone->name, // Explicitly requested field
                        'event_id'     => $event->id, // Useful for grouping or keys
                    ];
                }
            }
            // No 'else' block: We simply don't add "Missing" rows anymore.
        }

        // 6. Optional: Identify the "Active" file (e.g., the first one Pending/Review)
        // This highlights the file currently being processed
        $activeStageDocs = $documentsByMilestone[$currentStageKey] ?? [];
        $activeFile = collect($activeStageDocs)->first(function($doc) {
            return in_array($doc['status'], ['Pending', 'Reviewing', 'Revision']);
        });

        return Inertia::render('Student/management/thesis-management/documents', [
            'documentsByMilestone' => $documentsByMilestone,
            'group_id'             => $group->id,
            'current_stage_key'    => $currentStageKey,
            'active_event_id'      => $activeFile['id'] ?? null,
        ]);
    }

    public function documentUpload(Request $request)
    {
        // 1. Validation
        $request->validate([
            'title' => 'required|string|max:255',
            'file'  => 'required|file|max:102400', // 100MB
            // event_id is optional; if null, we determine it automatically
            'event_id' => 'nullable|exists:tbl_events,id', 
        ]);

        $user = Auth::user();

        // 2. Context: Get Group & Start Year
        $group = $user->student->group()
            ->with('sectionAdviser.assignment.schoolYear') 
            ->first();

        if (!$group) {
            return back()->with('error', 'No thesis group assigned.');
        }

        // 3. Context: Get Active Semester
        $activeSemester = Semester::with('schoolYear')
            ->where('is_active', true)
            ->first();

        if (!$activeSemester) {
            return back()->with('error', 'No active semester.');
        }

        // 4. Logic: Determine Current Stage (MOR, DP1, DP2)
        $groupStartYear = $group->sectionAdviser->assignment->schoolYear->year; 
        $activeYear = $activeSemester->schoolYear->year;
        
        // Formula: 3 + (ActiveYear - StartYear)
        $yearLevel = 3 + ($activeYear - $groupStartYear);
        
        $currentStage = 1; // Default MOR
        
        if ($yearLevel === 3) {
            $currentStage = 1; // MOR
        } elseif ($yearLevel >= 4) {
            // Check if 1st Sem (DP1) or 2nd Sem (DP2)
            if (Str::contains(Str::lower($activeSemester->name), ['1st', 'first'])) {
                $currentStage = 2; // DP1
            } else {
                $currentStage = 3; // DP2
            }
        }

        // 5. Logic: Resolve Event (The "Default" Logic)
        // If request has event_id, use it. Otherwise, find the first pending event.
        $eventId = $request->event_id;

        if (!$eventId) {
            // Find all events for this Semester + Stage
            // Ordered by the milestone sort_order
            $defaultEvent = Event::where('semester_id', $activeSemester->id)
                ->whereHas('milestone', function($q) use ($currentStage) {
                    $q->where('stage', $currentStage);
                })
                ->join('tbl_milestones', 'tbl_events.milestone_id', '=', 'tbl_milestones.id')
                ->orderBy('tbl_milestones.sort_order', 'asc')
                ->select('tbl_events.*') // Avoid id collision
                ->first();

            if ($defaultEvent) {
                $eventId = $defaultEvent->id;
            } else {
                return back()->with('error', 'No active events found for this stage.');
            }
        }

        // 6. Handle File Upload
        $disk = config('filesystems.default');
        $path = $request->file('file')->store("submissions/{$group->id}", $disk);

        // 7. Save to DB with Helpers
        Submission::create([
            'group_id'      => $group->id,
            'event_id'      => $eventId,
            // 'semester_id'   => $activeSemester->id, // Helper for efficient filtering
            'stage'         => $currentStage,       // Helper (1, 2, or 3)
            'title'         => $request->title,
            'document_type' => $request->document_type ?? 'Supporting Document',
            'description'   => $request->description,
            'file_path'     => $path,
            'status'        => 0, // Pending
        ]);

        return back()->with('success', 'Document uploaded successfully.');
    }

    public function documentDownload($id)
    {
        // Find submission by ID
        $submission = Submission::findOrFail($id);

        // Optional: Add security check (e.g., if auth user belongs to the group)
        // if ($submission->group_id !== Auth::user()->student->group_id) abort(403);

        // Check if file exists
        if (!Storage::disk('local')->exists($submission->file_path)) {
            return back()->with('error', 'File not found.');
        }

        // Download with original title
        $extension = pathinfo($submission->file_path, PATHINFO_EXTENSION);
        $filename = $submission->title . '.' . $extension;

        return Storage::download($submission->file_path, $filename);
    }

    public function documentView($id)
    {
        $submission = Submission::findOrFail($id);

        // Security Check: Ensure user belongs to the group
        // if ($submission->group_id !== Auth::user()->student->group_id) abort(403);

        if (!Storage::disk('local')->exists($submission->file_path)) {
            abort(404, 'File not found.');
        }

        $file = Storage::disk('local')->path($submission->file_path);
        $mimeType = Storage::disk('local')->mimeType($submission->file_path);

        // Return the file for inline viewing
        return response()->file($file, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $submission->title . '"'
        ]);
    }


    /**
     *  COMPARE PAGE
     */
    public function compare()
    {

        return Inertia::render('Student/management/thesis-management/compare');
    }

    /**
     *  WORKFLOW PAGE
     */
    public function workflow()
    {

        return Inertia::render('Student/management/thesis-management/workflow');
    }

    /**
     *  FINAL SUBMISSION PAGE
     */
    public function finalSubmission()
    {

        return Inertia::render('Student/management/thesis-management/final-submission');
    }

    /**
     *  CHANGE REQUEST PAGE
     */
    public function changeRequest()
    {

        return Inertia::render('Student/management/thesis-management/change-request');
    }
}
