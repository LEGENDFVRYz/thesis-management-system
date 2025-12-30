<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use App\Models\SchoolYear;
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

        // 1. GET ACTIVE SY (Keep this for mandatory active roles)
        $activeSemester = Semester::where('is_active', true)->first();
        if (!$activeSemester) {
            $this->command->error("No active semester found.");
            return;
        }
        $activeSyId = $activeSemester->school_year_id;

        // 2. GET ALL SY IDs (For random history/past assignments)
        // This will likely give you [1, 2] based on your seeder
        $allSyIds = SchoolYear::pluck('id'); 

        // 3. Fetch Roles
        $panelRole     = FacultyRole::where('role_name', 'Panelist')->first();
        $adviserRole   = FacultyRole::where('role_name', 'Adviser')->first();
        $committeeRole = FacultyRole::where('role_name', 'Committee')->first();
        $otherRoles    = FacultyRole::whereIn('role_name', ['Admin', 'Coordinator', 'Co-adviser'])->get();

        if (!$panelRole || !$adviserRole || !$committeeRole) return;

        // 4. Create/Get Faculties
        Faculty::factory(10)->create();
        $allFaculties = Faculty::all();

        foreach ($allFaculties as $faculty) {
            
            // =========================================================
            // A. MANDATORY: Panelist (ALWAYS ACTIVE SY)
            // We keep this on 2025 so they can function in the current app
            // =========================================================
            $this->assignRole($faculty->id, $panelRole->id, $activeSyId);

            // =========================================================
            // B. EXTRA ROLES (RANDOM SY)
            // This creates variety (2024 vs 2025)
            // =========================================================
            if (rand(1, 100) <= 70) {
                
                // Pick a random year (2024 or 2025)
                $randomSyId = $allSyIds->random(); 

                $isAdviser = rand(1, 100) <= 60;

                if ($isAdviser) {
                    // Assign Adviser to a RANDOM year
                    $this->assignRole($faculty->id, $adviserRole->id, $randomSyId);
                    
                    // Committee must match the same random year
                    $this->assignRole($faculty->id, $committeeRole->id, $randomSyId);
                    
                } elseif ($otherRoles->isNotEmpty()) {
                    $randomRole = $otherRoles->random();
                    $this->assignRole($faculty->id, $randomRole->id, $randomSyId);
                }
            }
        }

        $this->command->info("Assigned roles to {$allFaculties->count()} faculties across multiple School Years.");
    }

    private function assignRole($facultyId, $roleId, $syId)
    {
        FacultyAssignment::firstOrCreate([
            'faculty_id'  => $facultyId,
            'role_id'     => $roleId,
            'sy_id'       => $syId, 
        ], [
            'is_active'   => true,
        ]);
    }
}