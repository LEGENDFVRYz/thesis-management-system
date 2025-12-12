<?php

namespace Database\Seeders;

use App\Models\Proposal;
use App\Models\ThesisGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProposalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get all existing Thesis Groups
        $groups = ThesisGroup::all();

        if ($groups->isEmpty()) {
            $this->command->info('No Thesis Groups found. Skipping Proposal seeding.');
            return;
        }

        // 2. Loop through each group and create proposals for them
        foreach ($groups as $group) {
            
            // LOGIC: Create 3 proposals for this group
            $proposals = Proposal::factory()->count(3)->create([
                'group_id' => $group->id, // Force link to this loop's group
                'is_pursued' => false,    // Default all to false first
            ]);

            // LOGIC: Randomly decide if this group has successfully decided on a topic
            // 80% chance they picked a topic, 20% chance they are still deciding
            if (rand(1, 100) <= 80) {
                // Pick one random proposal from the 3 and make it the "Pursued" one
                $chosenProposal = $proposals->random();
                $chosenProposal->update(['is_pursued' => true]);
            }
        }
    }
}
