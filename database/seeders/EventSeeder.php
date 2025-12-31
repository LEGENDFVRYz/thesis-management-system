<?php

namespace Database\Seeders;

use App\Models\DeadlineTemplate;
use App\Models\Event;
use App\Models\Milestone;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get Active Semester
        $activeSemester = Semester::where('is_active', true)->first();
        if (!$activeSemester) {
            $this->command->error("No active semester found.");
            return;
        }

        $semStart = Carbon::parse($activeSemester->start_date);
        
        // 2. DEFINE CURRICULUM LOGIC
        // Which stages run in which semester?
        // 0 = 1st Sem, 1 = 2nd Sem
        $allowedStages = [];

        if ($activeSemester->semester == 1) { 
            // === 2ND SEMESTER (Active) ===
            // Logic: Graduating Students (DP2) + Irregulars (MOR)
            $allowedStages = [1, 3]; // 1=MOR, 3=DP2
            $this->command->info("Active Semester is 2nd Sem. Scheduling MOR and DP2 only.");
        } else {
            // === 1ST SEMESTER ===
            // Logic: Continuing Students (DP1)
            $allowedStages = [2]; // 2=DP1
            $this->command->info("Active Semester is 1st Sem. Scheduling DP1 only.");
        }

        // 3. Fetch ONLY templates for the allowed stages
        $templates = Milestone::whereIn('stage', $allowedStages)    // change due to updated migrations
                        ->orderBy('stage')
                        ->orderBy('id')
                        ->get();

        if ($templates->isEmpty()) {
            $this->command->warn("No templates found for stages: " . implode(',', $allowedStages));
            return;
        }

        // 4. Create Events
        $accumulatedDays = 0; 
        foreach ($templates as $template) {
            $accumulatedDays += $template->duration;
            $dueDate = $semStart->copy()->addDays($accumulatedDays);

            Event::firstOrCreate([
                'milestone_id' => $template->id,
                'semester_id'    => $activeSemester->id,
            ], [
                // 'title'    => $template->name, 
                'due_date' => $dueDate,
            ]);
        }
        
        $this->command->info("Scheduled " . $templates->count() . " events.");
    }
}
