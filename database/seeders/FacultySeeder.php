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
        // Predifined faculty roles
        $roles = [
            [
                'role_name' => 'Admin',
                'description' => 'Full access to the system, can manage all theses flow.'
            ],
            [
                'role_name' => 'Adviser',
                'description' => 'Guides and advises students about thesis.'
            ],
            [
                'role_name' => 'Co-adviser',
                'description' => 'Assists the adviser in guiding.'
            ],
            [
                'role_name' => 'Coordinator',
                'description' => 'Coordinates events and schedules of theses.'
            ],
            [
                'role_name' => 'Committee',
                'description' => 'Part of proposal checkjing.'
            ],
            [
                'role_name' => 'Panelist',
                'description' => 'Participates in evaluations in every defense'
            ],
        ];

        foreach ($roles as $role) {
            FacultyRole::updateOrCreate(
                ['role_name' => $role['role_name']], // Avoid duplicates
                ['description' => $role['description']]
            );
        }
        
        
        
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