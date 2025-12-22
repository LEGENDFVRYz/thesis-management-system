<?php

namespace Database\Seeders;

use App\Models\DefenseMatrix;
use App\Models\Endorsement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefenseMatrixSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Find Endorsements where BOTH checks are TRUE
        $approvedEndorsements = Endorsement::where('is_adviser_approved', true)
                                           ->where('is_coordinator_approved', true)
                                           ->get();

        if ($approvedEndorsements->isEmpty()) {
            $this->command->info('No fully approved endorsements found. Skipping Defense Matrix seeding.');
            return;
        }

        // 2. Schedule a Defense for these specific theses
        foreach ($approvedEndorsements as $endorsement) {
            
            // Prevent duplicates: Check if this endorsement already has a schedule
            if (DefenseMatrix::where('endorsement_id', $endorsement->id)->exists()) {
                continue;
            }

            DefenseMatrix::factory()->create([
                'endorsement_id' => $endorsement->id,
            ]);
        }
    }
}
