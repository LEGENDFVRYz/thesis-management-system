<?php

namespace Database\Seeders;

use App\Models\ArchivedJournal;
use App\Models\DefenseEvaluation;
use App\Models\DefenseMatrix;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArchivedJournalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get only DP2 (Final) Defenses
        $finalDefenses = DefenseMatrix::where('course', 'DP2')->get();

        foreach ($finalDefenses as $defense) {
            
            // 2. Get evaluations for this specific defense
            $evaluations = DefenseEvaluation::where('defense_id', $defense->id)->get();

            if ($evaluations->isEmpty()) {
                continue;
            }

            // 3. Calculate Average Grade
            $averageGrade = $evaluations->avg('grade');

            // 4. CHECK: Must be >= 75 to pass and be archived
            if ($averageGrade >= 75.00) {
                
                // Prevent duplicates
                if (ArchivedJournal::where('thesis_id', $defense->endorsement->thesis_id)->exists()) {
                    continue;
                }

                // 5. Create Archive Record
                ArchivedJournal::factory()->create([
                    'thesis_id' => $defense->endorsement->thesis->id,
                    
                    // Optional: Use words from the real thesis title as keywords
                    'keywords' => $this->generateKeywords($defense->endorsement->thesis->title ?? 'Research'),
                ]);
            }
        }
    }

    // Helper to turn title into keywords
    private function generateKeywords($title)
    {
        // Split title by spaces and join with commas
        return str_replace(' ', ', ', $title);
    }
}
