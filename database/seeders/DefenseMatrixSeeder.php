<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Endorsement;
use App\Models\DefenseMatrix;
use Carbon\Carbon;

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
            
            // Prevent duplicates
            if (DefenseMatrix::where('endorsement_id', $endorsement->id)->exists()) {
                continue;
            }

            $year = rand(2020, 2030);
            $month = rand(1, 12);
            $day = rand(1, 28);
            $hour = rand(8, 17); 

            $randomDate = Carbon::create($year, $month, $day, $hour, 0, 0);

            DefenseMatrix::factory()->create([
                'endorsement_id' => $endorsement->id,
                'defense_schedule' => $randomDate,
            ]);
        }
    }
}