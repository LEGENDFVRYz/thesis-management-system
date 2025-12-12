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
                                           ->with('thesis') // Load thesis to get the title
                                           ->get();

        if ($approvedEndorsements->isEmpty()) {
            $this->command->info('No fully approved endorsements found. Skipping Defense Matrix seeding.');
            return;
        }

        // 2. Schedule a Defense for these specific theses
        foreach ($approvedEndorsements as $endorsement) {
            
            // Prevent duplicates (one schedule per thesis)
            if (DefenseMatrix::where('thesis_id', $endorsement->thesis_id)->exists()) {
                continue;
            }

            DefenseMatrix::factory()->create([
                'thesis_id' => $endorsement->thesis_id,
                
            ]);
        }
    }
}
