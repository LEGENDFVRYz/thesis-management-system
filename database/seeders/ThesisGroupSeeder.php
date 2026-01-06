<?php

namespace Database\Seeders;

use App\Models\SchoolYear;
use App\Models\SectionAdviser;
use App\Models\Specialization;
use App\Models\Student;
use App\Models\ThesisGroup;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ThesisGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Pre-fetch Specs
        $specs = Specialization::pluck('id')->toArray();
        if (empty($specs)) {
            $this->command->error('No Specializations found.');
            return;
        }

        // ====================================================
        // MANUAL STUDENT SETUP
        // ====================================================
        
        // 1. Find the Manual Student User (Created in UserSeeder)
        $testStudentUser = User::where('email', 'student@example.com')->first();
        
        // 2. Find the Manual Adviser's Section (Section 1) for the ACTIVE year
        $activeSy = SchoolYear::whereHas('semesters', fn($q) => $q->where('is_active', true))->first();
        
        if ($activeSy) {
            $section1Adviser = SectionAdviser::where('section', 1)
                ->whereHas('assignment', fn($q) => $q->where('sy_id', $activeSy->id))
                ->first();

            // 3. Create Group for Test Student if user exists and not already profiled
            if ($testStudentUser && $section1Adviser && !Student::where('user_id', $testStudentUser->id)->exists()) {
                
                $this->command->info("Creating Manual Group for student@example.com in Section 1...");

                // Determine Spec ID (Odd Section = Spec 1)
                $assignedSpecId = $specs[0]; // Section 1 is odd, so Index 0

                $group = ThesisGroup::firstOrCreate([
                    'section_adviser_id' => $section1Adviser->id,
                    'group_number'       => 4 // Unique group number (seeders usually do 1-3)
                ]);

                // Create Leader (The Test Student)
                $leader = Student::factory()->create([
                    'user_id'    => $testStudentUser->id,
                    'first_name' => 'Student',
                    'last_name'  => 'User',
                    'group_id'   => $group->id,
                    'section'    => 1,
                    'spec_id'    => $assignedSpecId, 
                    'is_leader'  => true,
                ]);

                // Create Members
                Student::factory()->count(3)->create([
                    'group_id' => $leader->group_id,
                    'section'  => $leader->section,
                    'spec_id'  => $leader->spec_id,
                    'is_leader' => false,
                ]);
            }
        }


        // ====================================================
        // RANDOM BULK SEEDING
        // ====================================================

        // 1. Get all School Years
        $schoolYears = SchoolYear::all();

        if ($schoolYears->isEmpty()) {
            $this->command->error("No School Years found. Run SchoolYearSeeder first.");
            return;
        }

        foreach ($schoolYears as $sy) {
            $this->command->info("Seeding Random Groups for Batch: {$sy->year}");

            $advisersForBatch = SectionAdviser::whereHas('assignment', function($q) use ($sy) {
                $q->where('sy_id', $sy->id);
            })->get();

            foreach ($advisersForBatch as $adviser) {
                
                // Determine Specialization
                $specIndex = ($adviser->section % 2 === 0) ? 0 : 1;
                $assignedSpecId = $specs[$specIndex] ?? $specs[0];

                // Create 3 Groups per Section
                for ($groupNum = 1; $groupNum <= 3; $groupNum++) {
                    
                    $group = ThesisGroup::factory()->create([
                        'section_adviser_id' => $adviser->id,
                        'group_number' => $groupNum,
                    ]);

                    // Create Leader
                    Student::factory()->create([
                        'group_id'  => $group->id,
                        'section'   => $adviser->section,
                        'spec_id'   => $assignedSpecId,
                        'is_leader' => true,
                    ]);

                    // Create Members
                    Student::factory()->count(rand(2, 3))->create([
                        'group_id'  => $group->id,
                        'section'   => $adviser->section,
                        'spec_id'   => $assignedSpecId,
                        'is_leader' => false, // Explicitly false
                    ]);
                }
            }
        }
    }

    //     // Pre-fetch Specs to avoid querying inside loops
    //     $specs = Specialization::pluck('id')->toArray();
    //     if (empty($specs)) {
    //         $this->command->error('No Specializations found.');
    //         return;
    //     }

    //     // 1. Get all School Years (Active & Past)
    //     $schoolYears = SchoolYear::all();

    //     if ($schoolYears->isEmpty()) {
    //         $this->command->error("No School Years found. Run SchoolYearSeeder first.");
    //         return;
    //     }

    //     foreach ($schoolYears as $sy) {
    //         $this->command->info("Seeding Groups for Batch: {$sy->year}");

    //         // 2. Find Section Advisers LINKED to this School Year
    //         // We look up the chain: SectionAdviser -> FacultyAssignment -> SchoolYear
    //         $advisersForBatch = SectionAdviser::whereHas('assignment', function($q) use ($sy) {
    //             $q->where('sy_id', $sy->id);
    //         })->get();

    //         // 3. Create Groups for EACH Section Adviser in this batch
    //         foreach ($advisersForBatch as $adviser) {
                
    //             // Determine Specialization based on Adviser's Section
    //             $specIndex = ($adviser->section % 2 === 0) ? 0 : 1;
    //             $assignedSpecId = $specs[$specIndex] ?? $specs[0];

    //             // Create 3 Groups per Section
    //             for ($groupNum = 1; $groupNum <= 3; $groupNum++) {
                    
    //                 // Create the Group
    //                 $group = ThesisGroup::factory()->create([
    //                     'section_adviser_id' => $adviser->id,
    //                     'group_number' => $groupNum,
    //                 ]);

    //                 // Create EXACTLY ONE Leader
    //                 Student::factory()->create([
    //                     'group_id'  => $group->id,
    //                     'section'   => $adviser->section,
    //                     'spec_id'   => $assignedSpecId,
    //                     'is_leader' => true, // <--- Force True
    //                 ]);

    //                 // Create remaining Members (Randomly 2 or 3)
    //                 // Since factory default is false, these will always be members
    //                 Student::factory()->count(rand(2, 3))->create([
    //                     'group_id'  => $group->id,
    //                     'section'   => $adviser->section,
    //                     'spec_id'   => $assignedSpecId,
    //                 ]);
    //             }
    //         }
    //     }
    // }
}
