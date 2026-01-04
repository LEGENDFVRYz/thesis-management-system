<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SectionAdviser;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use App\Models\SchoolYear;
use App\Models\Semester;
use App\Models\User;

class SectionAdviserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

        $adviserRole = FacultyRole::where('role_name', 'Adviser')->first();
        $committeeRole = FacultyRole::where('role_name', 'Committee')->first();
        if (!$adviserRole) return;

        $schoolYears = SchoolYear::all(); 
        $sections = [1, 2, 3, 4, 5, 6, 7];

        // 1. Find our specific "Adviser User" (Ensures Section 1 is always him)
        $testAdviserUser = User::where('email', 'adviser@example.com')->first();
        $testAdviserFaculty = $testAdviserUser ? Faculty::where('user_id', $testAdviserUser->id)->first() : null;

        foreach ($schoolYears as $sy) {
            $this->command->info("Seeding Section Advisers for SY: {$sy->year}");

            foreach ($sections as $section) {
                
                // --- SAFETY CHECK: Prevent Duplicates ---
                // If this section already has an adviser for this specific year, SKIP IT.
                $exists = SectionAdviser::where('section', $section)
                    ->whereHas('assignment', fn($q) => $q->where('sy_id', $sy->id))
                    ->exists();

                if ($exists) {
                    continue; 
                }

                // --- LOGIC: Choose the Faculty ---
                if ($section === 1 && $testAdviserFaculty) {
                    // Section 1: Always the Test Adviser
                    $chosenFacultyId = $testAdviserFaculty->id;
                } else {
                    // Sections 2-7: Pick random faculty NOT already an adviser for this SY
                    // This distributes the load so one person isn't advising everyone
                    $existingAdviserIds = FacultyAssignment::where('role_id', $adviserRole->id)
                        ->where('sy_id', $sy->id)
                        ->pluck('faculty_id');

                    $randomFaculty = Faculty::whereNotIn('id', $existingAdviserIds)
                        ->inRandomOrder()
                        ->first();
                    
                    // Fallback: If we ran out of unique faculties, reuse one or create new
                    $chosenFacultyId = $randomFaculty 
                        ? $randomFaculty->id 
                        : (Faculty::inRandomOrder()->value('id') ?? Faculty::factory()->create()->id);
                }

                // --- LOGIC: Assign Roles (Adviser + Committee) ---
                
                // 1. Assign Adviser Role
                $adviserAssignment = FacultyAssignment::firstOrCreate([
                    'faculty_id' => $chosenFacultyId,
                    'role_id'    => $adviserRole->id,
                    'sy_id'      => $sy->id,
                ], ['is_active' => true]);

                // 2. Assign Committee Role (Because you requested Adviser = Committee)
                if ($committeeRole) {
                    FacultyAssignment::firstOrCreate([
                        'faculty_id' => $chosenFacultyId,
                        'role_id'    => $committeeRole->id,
                        'sy_id'      => $sy->id,
                    ], ['is_active' => true]);
                }

                // --- CREATE: The Section Adviser Record ---
                SectionAdviser::create([
                    'section' => $section,
                    'faculty_assign_id' => $adviserAssignment->id
                ]);
            }
        }


        // $adviserRole = \App\Models\FacultyRole::where('role_name', 'Adviser')->first();
        // if (!$adviserRole) return;

        // $schoolYears = \App\Models\SchoolYear::all(); 
        // $sections = [1, 2, 3, 4, 5, 6, 7];

        // foreach ($schoolYears as $sy) {
        //     $this->command->info("Seeding Sections for SY: {$sy->year}");

        //     foreach ($sections as $section) {
                
        //         // 1. Check if Section Adviser already exists (Safety Check)
        //         $exists = \App\Models\SectionAdviser::where('section', $section)
        //             ->whereHas('assignment', fn($q) => $q->where('sy_id', $sy->id))
        //             ->exists();

        //         if ($exists) continue;

        //         // 2. Find or Create a Faculty Assignment (Preventing Duplicates)
        //         // Try to find an existing random adviser for this SY
        //         $assignment = \App\Models\FacultyAssignment::where('role_id', $adviserRole->id)
        //             ->where('sy_id', $sy->id)
        //             ->inRandomOrder()
        //             ->first();

        //         // If none exists, create one using firstOrCreate to avoid duplicates
        //         if (!$assignment) {
        //             // Pick a random faculty
        //             $randomFacultyId = \App\Models\Faculty::inRandomOrder()->value('id') 
        //                 ?? \App\Models\Faculty::factory()->create()->id;

        //             $assignment = \App\Models\FacultyAssignment::firstOrCreate(
        //                 [
        //                     'faculty_id' => $randomFacultyId,
        //                     'role_id'    => $adviserRole->id,
        //                     'sy_id'      => $sy->id,
        //                 ],
        //                 ['is_active' => true]
        //             );
        //         }

        //         // 3. Create the Section Adviser
        //         \App\Models\SectionAdviser::create([
        //             'section' => $section,
        //             'faculty_assign_id' => $assignment->id,
        //         ]);
        //     }
        // }
    }
}
