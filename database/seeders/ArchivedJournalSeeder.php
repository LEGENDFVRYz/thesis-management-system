<?php

namespace Database\Seeders;

use App\Jobs\GenerateDummyManuscriptJob;
use App\Models\ArchivedJournal;
use App\Models\DefenseEvaluation;
use App\Models\DefenseMatrix;
use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class ArchivedJournalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // List of Realistic Computer Engineering Keywords
        $cpeKeywords = [
            'Embedded Systems', 'Internet of Things (IoT)', 'Computer Vision', 'Artificial Intelligence', 'Machine Learning',
            'Robotics & Automation', 'Network Security', 'Data Science & Analytics', 'Software Engineering', 'Web & Mobile Computing',
            'Digital Signal Processing', 'Cloud Computing', 'System Architecture', 'Wireless Communications', 'Cybersecurity',
            'Information Systems', 'Human-Computer Interaction'
        ];

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

                $randomKeywords = Arr::random($cpeKeywords, rand(3, 6));
                $keywordsString = implode(', ', $randomKeywords);

                // 5. Create Archive Record
                $faker = Factory::create();
                $dummy_filename = 'journal_' . $faker->uuid() . '.pdf';
                $dummy_filepath = 'archives/2025/';

                $archive = ArchivedJournal::factory()->create([
                    'thesis_id' => $defense->endorsement->thesis->id,
                    'file_path' => $dummy_filepath . $dummy_filename,
                    
                    // Optional: Use words from the real thesis title as keywords
                    'keywords' => $keywordsString,
                ]);

                // Generate Dummy Manuscript PDF for this archived journal
                GenerateDummyManuscriptJob::dispatchSync(
                    $dummy_filepath,                       // folder
                    $dummy_filename,              // filename
                    $archive->thesis->title ?? 'Untitled Manuscript'    // title
                );

                $this->command->info("✅ Dummy manuscript generated: {$dummy_filename}");
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
