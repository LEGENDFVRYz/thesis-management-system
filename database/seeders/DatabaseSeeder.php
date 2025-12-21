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

            UserSeeder::class,
            FacultySeeder::class,
            
            SectionAdviserSeeder::class,
            ThesisGroupSeeder::class,
            ProposalSeeder::class,
            ProposalEvaluationSeeder::class,
            ThesesSeeder::class,
            EndorsementSeeder::class,
            DefenseMatrixSeeder::class,
            DefenseEvaluationSeeder::class,
            ArchivedJournalSeeder::class,
            StudentSeeder::class
        ]);

        // Faculty::factory(10)->create();
    }
}
