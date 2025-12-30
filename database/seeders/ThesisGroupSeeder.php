<?php

namespace Database\Seeders;

use App\Models\SchoolYear;
use App\Models\SectionAdviser;
use App\Models\ThesisGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ThesisGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get all School Years (Active & Past)
        $schoolYears = SchoolYear::all();

        if ($schoolYears->isEmpty()) {
            $this->command->error("No School Years found. Run SchoolYearSeeder first.");
            return;
        }

        foreach ($schoolYears as $sy) {
            $this->command->info("Seeding Groups for Batch: {$sy->year}");

            // 2. Find Section Advisers LINKED to this School Year
            // We look up the chain: SectionAdviser -> FacultyAssignment -> SchoolYear
            $advisersForBatch = SectionAdviser::whereHas('assignment', function($q) use ($sy) {
                $q->where('sy_id', $sy->id);
            })->get();

            // 3. Create Groups for EACH Section Adviser in this batch
            foreach ($advisersForBatch as $adviser) {
                
                // Create 3 groups per section (Group 1, Group 2, Group 3)
                // This guarantees every section has data
                ThesisGroup::factory()->count(3)->sequence(
                    ['group_number' => 1],
                    ['group_number' => 2],
                    ['group_number' => 3]
                )->create([
                    'section_adviser_id' => $adviser->id, // Force the correct year link
                ]);
            }
        }
    }
}
