<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $faker = Faker::create();
        $allowedRoles = FacultyRole::whereIn('role_name', ['Adviser', 'Committee', 'Panelist'])->pluck('id')->toArray();
        
        // Create new faculty user with faculties subroles
        $faculties = Faculty::factory(10)->create();

        foreach ($faculties as $faculty) {
            FacultyAssignment::create([
                'faculty_id'  => $faculty->id,
                'role_id'     => $faker->randomElement($allowedRoles), // Pick random allowed role ID
                'school_year' => 2025,
                'is_active'   => true,
            ]);
        }
    }
}