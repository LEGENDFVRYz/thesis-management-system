<?php

namespace Database\Seeders;

use App\Models\Endorsement;
use App\Models\Theses;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EndorsementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get all Theses
        $theses = Theses::all();

        if ($theses->isEmpty()) {
            $this->command->info('No Theses found. Skipping Endorsement seeding.');
            return;
        }

        // 2. Create an Endorsement record for each thesis
        foreach ($theses as $thesis) {
            
            // Check to avoid duplicates
            if (Endorsement::where('thesis_id', $thesis->id)->exists()) {
                continue;
            }

            // Logic: Most theses in the system are "Approved" so we can test the Defense module next.
            Endorsement::factory()->create([
                'thesis_id' => $thesis->id,
            ]);
        }
    }
}
