<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SectionAdviser;
use App\Models\FacultyAssignment;

class SectionAdviserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // 1. Get ONLY the existing assignments that are 'Advisers'
        $existingAdvisers = FacultyAssignment::whereHas('role', function($q) {
            $q->where('role_name', 'Adviser');
        })->inRandomOrder()->get();

        // 2. Define exactly which sections you want (Fixed List)
        $sections = [1, 2, 3, 4, 5, 6, 7];

        foreach ($sections as $index => $section) {
            
            // 3. Try to pick an adviser for this slot.
            // If we run out of advisers, $adviser becomes NULL.
            $adviser = $existingAdvisers[$index] ?? null;

            // 4. Create the record
            SectionAdviser::factory()->create([
                // FORCE the section to be the loop value (1, then 2, etc.)
                // This overrides the random number in your Factory.
                'section' => $section, 
                
                // Use the existing faculty member or set to NULL (Vacant)
                'faculty_assign_id' => $adviser ? $adviser->id : null,
            ]);
        }
    }
}
