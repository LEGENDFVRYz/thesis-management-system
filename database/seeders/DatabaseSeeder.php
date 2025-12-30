<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\Student;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            FacultyRoleSeeder::class,
            SpecializationSeeder::class,
            SchoolYearSeeder::class,
            DeadlineTemplateSeeder::class,
            EventSeeder::class,
            AnnouncementSeeder::class,
            
            UserSeeder::class,
            FacultySeeder::class,
            AvailabilitySeeder::class,
            
            SectionAdviserSeeder::class,
            ThesisGroupSeeder::class,
            ProposalSeeder::class,
            ProposalEvaluationSeeder::class,
            ThesesSeeder::class,
            EndorsementSeeder::class,
            DefenseMatrixSeeder::class,
            EndorsedPanelSeeder::class,
            DefenseEvaluationSeeder::class,
            ArchivedJournalSeeder::class,
            StudentSeeder::class,
            ResourceSeeder::class,
            
            // grading criteria seeder
            GradingCriteriasSeeder::class,
            GradingRubricsSeeder::class,
            RubricLevelsSeeder::class,
        ]);

        // Faculty::factory(10)->create();
    }
}
