<?php

namespace Database\Seeders;

use App\Models\DefenseEvaluation;
use App\Models\DefenseMatrix;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use App\Models\GradingRubric;
use App\Models\RubricScore;
use Carbon\Carbon;
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
            return;
        }

        // Get valid Panelists for substitution logic
        $panelistRole = FacultyRole::where('role_name', 'Panelist')->first();
        $allPanelists = FacultyAssignment::where('role_id', $panelistRole->id)->get();

        // Loop through every scheduled defense
        $defenses = DefenseMatrix::with('endorsedPanels')->get();

        foreach ($defenses as $defense) {
            
            // Parse the defense schedule
            $scheduleTime = Carbon::parse($defense->defense_schedule);
            
            // Calculate a realistic "Evaluation Time" (e.g., 2 hours after start)
            $evaluationTime = $scheduleTime->copy()->addHours(2);

            // LOGIC CHECK: Only grade if this evaluation time is in the past relative to NOW
            if (Carbon::now()->lessThan($evaluationTime)) {
                // Skip upcoming defenses (Future)
                continue; 
            }

            // Get the panels we seeded
            $confirmedPanels = $defense->endorsedPanels->where('is_confirmed', true);

            if ($confirmedPanels->isEmpty()) continue;

            foreach ($confirmedPanels as $panelInvitation) {
                
                // ATTENDANCE LOGIC
                $isPresent = (rand(1, 100) <= 90);
                
                if ($isPresent) {
                    $evaluatorId = $panelInvitation->panel_id;
                } else {
                    $excludedIds = $confirmedPanels->pluck('panel_id')->toArray();
                    // Pick a random substitute who matches the SY if possible, 
                    // or just random from list for simplicity in fallback
                    $substitute = $allPanelists->whereNotIn('id', $excludedIds)->random();
                    $evaluatorId = $substitute->id;
                }

                // Create the Evaluation with REALISTIC DATE
                $evaluation = DefenseEvaluation::create([
                    'defense_id'   => $defense->id,
                    'evaluator_id' => $evaluatorId,
                    'grade'        => rand(80, 98),
                    'comment'      => 'Good job, minor revisions needed.',
                    'remarks'      => 'Minor Revisions',
                    // OVERRIDE TIMESTAMPS
                    'created_at'   => $evaluationTime,
                    'updated_at'   => $evaluationTime,
                ]);

                // Create Rubric Scores with SAME TIMESTAMP
                foreach ($rubrics as $rubric) {
                    RubricScore::create([
                        'evaluation_id' => $evaluation->id,
                        'rubric_id'     => $rubric->id,
                        'rating'        => rand(2, 4),
                        'created_at'    => $evaluationTime,
                        'updated_at'    => $evaluationTime,
                    ]);
                }
            }
        }
    }
}
