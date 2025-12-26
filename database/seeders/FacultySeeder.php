<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use App\Models\Semester;
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

        // 1. FIND ACTIVE SCHOOL YEAR ID via Active Semester
        $activeSemester = Semester::where('is_active', true)->first();

        if (!$activeSemester) {
            $this->command->error("No active semester found. Run SchoolYearSeeder first.");
            return;
        }
        
        // EXTRACT THE SY ID HERE to pass it cleanly later
        $activeSyId = $activeSemester->school_year_id;

        // 2. Fetch Key Roles
        $panelRole     = FacultyRole::where('role_name', 'Panelist')->first();
        $adviserRole   = FacultyRole::where('role_name', 'Adviser')->first();
        $committeeRole = FacultyRole::where('role_name', 'Committee')->first();
        
        $otherRoles = FacultyRole::whereIn('role_name', ['Admin', 'Coordinator', 'Co-adviser'])->get();

        if (!$panelRole || !$adviserRole || !$committeeRole) {
            $this->command->error("Required roles are missing. Seed roles first.");
            return;
        }

        // 3. Create New Dummy Faculties
        Faculty::factory(10)->create();

        // 4. SCAN EVERY FACULTY IN THE DATABASE
        $allFaculties = Faculty::all();

        foreach ($allFaculties as $faculty) {
            
            // A. MANDATORY: Everyone becomes a Panelist
            // Pass the SY ID, not the Semester ID
            $this->assignRole($faculty->id, $panelRole->id, $activeSyId);

            // B. EXTRA ROLES LOGIC
            if (rand(1, 100) <= 70) {
                
                $isAdviser = rand(1, 100) <= 60;

                if ($isAdviser) {
                    $this->assignRole($faculty->id, $adviserRole->id, $activeSyId);
                    $this->assignRole($faculty->id, $committeeRole->id, $activeSyId);
                    
                } elseif ($otherRoles->isNotEmpty()) {
                    $randomRole = $otherRoles->random();
                    $this->assignRole($faculty->id, $randomRole->id, $activeSyId);
                }
            }
        }

        $this->command->info("Assigned roles to {$allFaculties->count()} faculty members for SY ID: {$activeSyId}.");
    }

    /**
     * Helper function to safely assign roles
     */
    private function assignRole($facultyId, $roleId, $syId)
    {
        FacultyAssignment::firstOrCreate([
            'faculty_id'  => $facultyId,
            'role_id'     => $roleId,
            'sy_id'       => $syId, // Now uses the variable passed to the function
        ], [
            'is_active'   => true,
        ]);
    }
}