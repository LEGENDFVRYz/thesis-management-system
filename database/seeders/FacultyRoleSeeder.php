<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\FacultyRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultyRoleSeeder extends Seeder
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
            [
                'role_name' => 'Awardee',
                'description' => 'The one who award the best thesis'
            ],
        ];

        foreach ($roles as $role) {
            FacultyRole::updateOrCreate(
                ['role_name' => $role['role_name']], // Avoid duplicates
                ['description' => $role['description']]
            );
        }
        
        // Add more faculty for testing
        // Faculty::factory()->count(20)->create();
    }
}
