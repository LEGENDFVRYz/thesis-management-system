<?php

namespace Database\Seeders;

use App\Models\DefenseEvaluation;
use App\Models\DefenseMatrix;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use App\Models\GradingRubric;
use App\Models\RubricScore;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefenseEvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // PRE-FETCH RUBRICS
        $rubrics = GradingRubric::all();

        if ($rubrics->isEmpty()) {
            $this->command->warn('No Grading Rubrics found. Scores will not be generated.');
        }

        // Get valid Panelists for substitution logic
        $panelistRole = FacultyRole::where('role_name', 'Panelist')->first();
        $allPanelists = FacultyAssignment::where('role_id', $panelistRole->id)->get();

        // Loop through every scheduled defense
        // Eager load 'endorsedPanels' to see who was SUPPOSED to be there
        $defenses = DefenseMatrix::with('endorsedPanels')->get();

        foreach ($defenses as $defense) {

            // Filter only the 3 CONFIRMED panelists
            $confirmedPanels = $defense->endorsedPanels->where('is_confirmed', true);

            if ($confirmedPanels->isEmpty()) {
                continue;
            }

            foreach ($confirmedPanels as $panelInvitation) {
                
                // ATTENDANCE LOGIC
                // 90% chance the confirmed panel attends. 10% chance they are absent.
                $isPresent = (rand(1, 100) <= 90);
                
                if ($isPresent) {
                    // Scenario A: The confirmed panel grades the student
                    $evaluatorId = $panelInvitation->panel_id;
                } else {
                    // Scenario B: SUBSTITUTION
                    // Pick a random faculty who is NOT one of the original invited panels
                    $excludedIds = $confirmedPanels->pluck('panel_id')->toArray();
                    $substitute = $allPanelists->whereNotIn('id', $excludedIds)->random();
                    $evaluatorId = $substitute->id;
                }

                // Create the Evaluation
                $evaluation = DefenseEvaluation::factory()->create([
                    'defense_id'   => $defense->id,
                    'evaluator_id' => $evaluatorId,
                ]);

                // Create Rubric Scores for this specific evaluation
                foreach ($rubrics as $rubric) {
                    RubricScore::factory()->create([
                        'evaluation_id' => $evaluation->id,
                        'rubric_id'     => $rubric->id,
                        'rating'        => rand(1, 4),
                    ]);
                }
            }
        }
    }
}
