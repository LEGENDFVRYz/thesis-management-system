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

class SectionAdviserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // 1. Fetch the Adviser Role ID
        $adviserRole = FacultyRole::where('role_name', 'Adviser')->first();

        if (!$adviserRole) {
            $this->command->error("Adviser role not found. Seed roles first.");
            return;
        }

        // 2. Fetch ALL School Years (Both Active 2025 and Past 2024)
        $schoolYears = SchoolYear::all(); 

        // 3. Define your Sections
        $sections = [1, 2, 3, 4, 5, 6, 7];

        // 4. OUTER LOOP: Iterate through each School Year (Batch)
        foreach ($schoolYears as $sy) {
            
            $this->command->info("Seeding Section Advisers for School Year: {$sy->year}");

            // A. Find existing Faculty Assignments for this specific SY and Role
            $availableAssignments = FacultyAssignment::where('role_id', $adviserRole->id)
                ->where('sy_id', $sy->id)
                ->get();

            // INNER LOOP: Iterate through Sections
            foreach ($sections as $index => $section) {
                
                // B. Get an adviser for this specific batch
                // If we don't have enough existing assignments, CREATE one on the fly.
                if ($index < $availableAssignments->count()) {
                    $assignmentId = $availableAssignments[$index]->id;
                } else {
                    // Fallback: Create a new Faculty Assignment specifically for this SY
                    // This ensures we never have a "null" adviser for a section
                    $newAssignment = FacultyAssignment::factory()->create([
                        'role_id'   => $adviserRole->id,
                        'sy_id'     => $sy->id,
                        'faculty_id'=> Faculty::inRandomOrder()->first()->id ?? Faculty::factory(),
                        'is_active' => true,
                    ]);
                    $assignmentId = $newAssignment->id;
                }

                // C. Create the Section Adviser Record
                // This creates: { id: ..., section: 1, faculty_assign_id: [Linked to SY 2025] }
                // AND later:    { id: ..., section: 1, faculty_assign_id: [Linked to SY 2024] }
                SectionAdviser::create([
                    'section'           => $section,
                    'faculty_assign_id' => $assignmentId,
                ]);
            }
        }
    }
}
