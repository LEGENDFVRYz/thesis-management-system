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
        
        // Roles & Years
        $panelRole = FacultyRole::where('role_name', 'Panelist')->first();
        $coordinatorRole = FacultyRole::where('role_name', 'Coordinator')->first();
        $schoolYears = SchoolYear::all(); // Get ALL years

        // Create Filler Faculties
        $faculties = Faculty::factory(10)->create();

        // Assign PANELIST role to everyone for ALL years
        foreach ($schoolYears as $sy) {
            foreach ($faculties as $faculty) {
                FacultyAssignment::firstOrCreate([
                    'faculty_id' => $faculty->id,
                    'role_id'    => $panelRole->id,
                    'sy_id'      => $sy->id,
                ], ['is_active' => true]);
            }
        }

        // Ensure ONE Coordinator per School Year
        if ($coordinatorRole) {
            foreach ($schoolYears as $sy) {
                
                // Check if UserSeeder already made a coordinator for this year
                $hasCoordinator = FacultyAssignment::where('role_id', $coordinatorRole->id)
                    ->where('sy_id', $sy->id)
                    ->exists();

                if (!$hasCoordinator) {
                    // Pick a random faculty to fill the gap
                    $randomFaculty = $faculties->random();
                    FacultyAssignment::create([
                        'faculty_id' => $randomFaculty->id,
                        'role_id'    => $coordinatorRole->id,
                        'sy_id'      => $sy->id,
                        'is_active'  => true,
                    ]);
                    $this->command->info("Assigned random Coordinator for SY: {$sy->year}");
                }
            }
        }
        
        // $faker = Faker::create();

        // // 1. GET ACTIVE SY (Keep this for mandatory active roles)
        // $activeSemester = Semester::where('is_active', true)->first();
        // if (!$activeSemester) {
        //     $this->command->error("No active semester found.");
        //     return;
        // }
        // $activeSyId = $activeSemester->school_year_id;

        // // 2. GET ALL SY IDs (For random history/past assignments)
        // // This will likely give you [1, 2] based on your seeder
        // $allSyIds = SchoolYear::pluck('id'); 

        // // 3. Fetch Roles
        // $panelRole     = FacultyRole::where('role_name', 'Panelist')->first();
        // $adviserRole   = FacultyRole::where('role_name', 'Adviser')->first();
        // $committeeRole = FacultyRole::where('role_name', 'Committee')->first();
        // $coordinatorRole = FacultyRole::where('role_name', 'Coordinator')->first();
        // $otherRoles    = FacultyRole::whereIn('role_name', ['Admin', 'Co-adviser'])->get();

        // if (!$panelRole || !$adviserRole || !$committeeRole || !$coordinatorRole) return;

        // // 4. Create/Get Faculties
        // Faculty::factory(10)->create();
        // $allFaculties = Faculty::all();

        // foreach ($allFaculties as $faculty) {
            
        //     // MANDATORY: Panelist (ALWAYS ACTIVE SY)
        //     $this->assignRole($faculty->id, $panelRole->id, $activeSyId);

        //     // EXTRA ROLES (RANDOM SY)
        //     if (rand(1, 100) <= 70) {
                
        //         // Pick a random year (2024 or 2025)
        //         $randomSyId = $allSyIds->random(); 

        //         $isAdviser = rand(1, 100) <= 60;

        //         if ($isAdviser) {
        //             // Assign Adviser to a RANDOM year
        //             $this->assignRole($faculty->id, $adviserRole->id, $randomSyId);
                    
        //             // Committee must match the same random year
        //             $this->assignRole($faculty->id, $committeeRole->id, $randomSyId);
                    
        //         } elseif ($otherRoles->isNotEmpty()) {
        //             $randomRole = $otherRoles->random();
        //             $this->assignRole($faculty->id, $randomRole->id, $randomSyId);
        //         }
        //     }
        // }

        // foreach ($allSyIds as $syId) {
        //     $hasCoordinator = FacultyAssignment::where('role_id', $coordinatorRole->id)
        //         ->where('sy_id', $syId)
        //         ->exists();

        //     if (!$hasCoordinator) {
        //         $randomFaculty = $allFaculties->random();
        //         $this->assignRole($randomFaculty->id, $coordinatorRole->id, $syId);
        //         $this->command->info("Assigned fallback Coordinator for SY ID: {$syId}");
        //     }
        // }

        // $this->command->info("Assigned roles to {$allFaculties->count()} faculties.");
    }

    // private function assignRole($facultyId, $roleId, $syId)
    // {
    //     FacultyAssignment::firstOrCreate([
    //         'faculty_id'  => $facultyId,
    //         'role_id'     => $roleId,
    //         'sy_id'       => $syId, 
    //     ], [
    //         'is_active'   => true,
    //     ]);
    // }
}