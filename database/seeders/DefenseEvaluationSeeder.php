<?php

namespace Database\Seeders;

use App\Models\DefenseEvaluation;
use App\Models\DefenseMatrix;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefenseEvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get valid Panelists for substitution logic later
        $panelistRole = FacultyRole::where('role_name', 'Panelist')->first();
        $allPanelists = FacultyAssignment::where('role_id', $panelistRole->id)->get();

        // 2. Loop through every scheduled defense
        // Eager load 'endorsedPanels' to see who was SUPPOSED to be there
        $defenses = DefenseMatrix::with('endorsedPanels')->get();

        foreach ($defenses as $defense) {

            // 3. Filter only the 3 CONFIRMED panelists
            $confirmedPanels = $defense->endorsedPanels->where('is_confirmed', true);

            if ($confirmedPanels->isEmpty()) {
                continue;
            }

            foreach ($confirmedPanels as $panelInvitation) {
                
                // 4. ATTENDANCE LOGIC
                // 90% chance the confirmed panel attends. 10% chance they are absent.
                $isPresent = (rand(1, 100) <= 90);
                
                if ($isPresent) {
                    // Scenario A: The confirmed panel grades the student
                    $evaluatorId = $panelInvitation->panel_id;
                } else {
                    // Scenario B: SUBSTITUTION
                    // Pick a random faculty who is NOT one of the original invited panels
                    // (To avoid duplicate evaluators in the same room)
                    $excludedIds = $confirmedPanels->pluck('panel_id')->toArray();
                    
                    $substitute = $allPanelists->whereNotIn('id', $excludedIds)->random();
                    $evaluatorId = $substitute->id;
                }

                // 5. Create the Evaluation
                DefenseEvaluation::factory()->create([
                    'defense_id'   => $defense->id,
                    'evaluator_id' => $evaluatorId,
                    // Grades/Comments are handled by the Factory's random logic
                ]);
            }
        }
    }
}
