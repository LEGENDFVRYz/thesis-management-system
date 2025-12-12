<?php

namespace Database\Seeders;

use App\Models\DefenseEvaluation;
use App\Models\DefenseMatrix;
use App\Models\FacultyAssignment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefenseEvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get all Scheduled Defenses
        $defenses = DefenseMatrix::all();

        // 2. Get ONLY Faculty who are 'Panelists'
        $panelists = FacultyAssignment::whereHas('role', function($q) {
            $q->where('role_name', 'Panelist');
        })->get();

        // Safety Checks
        if ($defenses->isEmpty()) {
            $this->command->info('No Defenses scheduled. Skipping Evaluation seeding.');
            return;
        }
        if ($panelists->count() < 3) {
            $this->command->warn('Not enough Panelists found (Need at least 3). Skipping Evaluation seeding.');
            return;
        }

        // 3. Assign 3 Panelists to EACH Defense
        foreach ($defenses as $defense) {
            
            // Pick 3 random unique panelists from the list
            $assignedPanelists = $panelists->random(3);

            foreach ($assignedPanelists as $panelist) {
                DefenseEvaluation::factory()->create([
                    'defense_id' => $defense->id,
                    'evaluator_id' => $panelist->id,
                ]);
            }
        }
    }
}
