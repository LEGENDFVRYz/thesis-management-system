<?php

namespace Database\Seeders;

use App\Models\Proposal;
use App\Models\Theses;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ThesesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Fetch ONLY the proposals that were approved/pursued
        $pursuedProposals = Proposal::where('is_pursued', true)->get();

        if ($pursuedProposals->isEmpty()) {
            $this->command->info('No pursued proposals found. Skipping Thesis seeding.');
            return;
        }

        // 2. Promote each pursued proposal into a Thesis
        foreach ($pursuedProposals as $proposal) {
            
            // Check if this proposal already became a thesis (prevent duplicates)
            if (Theses::where('proposal_id', $proposal->id)->exists()) {
                continue;
            }

            $year = rand(2020, 2030);
            $month = rand(1, 12);
            $day = rand(1, 28);
            $hour = rand(8, 17);

            $randomDate = Carbon::create($year, $month, $day, $hour, 0, 0);

            Theses::factory()->create([
                'proposal_id' => $proposal->id,
                
                // By default, use the exact title from the proposal (overrided by factory)
                'title' => $proposal->proposal_title, 
                'created_at' => $randomDate,
            ]);
        }
    }
}
