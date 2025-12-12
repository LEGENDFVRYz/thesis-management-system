<?php

namespace Database\Seeders;

use App\Models\FacultyAssignment;
use App\Models\Proposal;
use App\Models\ProposalEvaluation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProposalEvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get all Proposals
        $proposals = Proposal::all();

        // 2. Get Valid Evaluators (Committee & Coordinator ONLY)
        // We look into the related 'role' table to check the name
        $evaluators = FacultyAssignment::whereHas('role', function($q) {
            $q->whereIn('role_name', ['Committee']);
        })->get();

        // Safety Check
        if ($proposals->isEmpty() || $evaluators->isEmpty()) {
            $this->command->info('Missing Proposals or Committee Members. Skipping Evaluation seeding.');
            return;
        }

        // 3. Loop through proposals and assign random evaluations
        foreach ($proposals as $proposal) {
            
            // LOGIC: Randomly pick 1 to 3 evaluators for this proposal
            $randomEvaluators = $evaluators->random(rand(1, 3));

            foreach ($randomEvaluators as $evaluator) {
                ProposalEvaluation::factory()->create([
                    'proposal_id'  => $proposal->id,
                    'evaluator_id' => $evaluator->id,
                    
                    // Logic: If the proposal was "Pursued", let's make the evaluations mostly positive
                    'is_approved'  => $proposal->is_pursued ? true : (rand(0, 1) == 1),
                    
                    'comment'      => $proposal->is_pursued 
                                      ? "Good topic, proceed." 
                                      : "Needs major revision on objectives.",
                ]);
            }
        }
    }
}
