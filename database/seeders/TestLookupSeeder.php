<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Seeds only the static lookup tables that model factories depend on
 * transitively (FacultyRole via SectionAdviser/FacultyAssignment, Specialization
 * via Student). Used as the test suite's RefreshDatabase seeder instead of the
 * full DatabaseSeeder, which also inserts unrelated fake data rows.
 */
class TestLookupSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FacultyRoleSeeder::class,
            SpecializationSeeder::class,
        ]);
    }
}
