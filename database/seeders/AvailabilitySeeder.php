<?php

namespace Database\Seeders;

use App\Models\Availability;
use App\Models\Event;
use App\Models\Faculty;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Find the specific "Defense" events we just seeded
        // We look for events linked to templates with 'defense' in the anchor
        $defenseEvents = Event::whereHas('deadlineTemplate', function($q) {
            $q->whereIn('anchor', ['mor_defense', 'dp1_defense', 'dp2_defense']);
        })->get();

        if ($defenseEvents->isEmpty()) {
            $this->command->warn("No Defense events found. Run EventSeeder first.");
            return;
        }

        // 2. Get All Faculties (Potential Panelists)
        $faculties = Faculty::all();

        foreach ($defenseEvents as $event) {
            
            // For each faculty, create availability slots during this defense week/event
            foreach ($faculties as $faculty) {
                
                // Scenario: Faculty is available on the due_date from 8 AM to 5 PM
                $date = Carbon::parse($event->due_date);
                
                Availability::firstOrCreate([
                    'faculty_id'      => $faculty->id,
                    'defense_week_id' => $event->id, // Links to the specific Defense Event
                ], [
                    'start_date' => $date->copy()->setTime(8, 0, 0),  // 8:00 AM
                    'end_date'   => $date->copy()->setTime(17, 0, 0), // 5:00 PM
                ]);
            }
        }

        // DEBUG: Check if we have any events at all
        $totalEvents = \App\Models\Event::count();
        $this->command->info("Total Events Found: " . $totalEvents);

        // DEBUG: Check if we have the specific defense templates
        $templates = \App\Models\DeadlineTemplate::whereIn('anchor', ['mor_defense', 'dp1_defense', 'dp2_defense'])->get();
        $this->command->info("Defense Templates Found: " . $templates->count());

        $this->command->info("Generated availability slots for {$defenseEvents->count()} defense events.");
    }
}
