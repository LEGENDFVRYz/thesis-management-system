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

            // rading criteria seeder
            GradingCriteriasSeeder::class,
            GradingRubricsSeeder::class,
            RubricLevelsSeeder::class,
            
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
            ResourceSeeder::class,

            // ThesisGroupSeeder now handles Student creation
            // StudentSeeder::class,
        ]);

        // Faculty::factory(10)->create();
    }
}
