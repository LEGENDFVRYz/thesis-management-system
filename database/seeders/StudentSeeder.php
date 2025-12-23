<?php

namespace Database\Seeders;

use App\Models\Specialization;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\ThesisGroup;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get ALL groups and eager load the adviser to access the real section
        $groups = ThesisGroup::with('sectionAdviser')->get();

        if ($groups->isEmpty()) {
            $this->command->info('No Thesis Groups found. Skipping Student seeding.');
            return;
        }

        // 2. Fetch all Specialization IDs to assign them logically
        $specs = Specialization::pluck('id')->toArray(); // e.g., [1, 2]

        if (empty($specs)) {
            $this->command->warn('No Specializations found. Please seed specializations first.');
            return;
        }

        foreach ($groups as $group) {
            
            // 3. GET REAL SECTION
            // Access the section from the linked adviser (tbl_section_advisers)
            // Fallback to '1' if relation is missing to prevent crash
            $realSection = $group->sectionAdviser?->section ?? 1;

            // 4. DETERMINE SPECIALIZATION BASED ON SECTION
            // Logic: Odd sections (1,3,5) get 1st Spec; Even sections (2,4,6) get 2nd Spec
            // This ensures all students in one section have the same major.
            $specIndex = ($realSection % 2 === 0) ? 0 : 1;
            
            // Safety: If you only have 1 spec, always use index 0
            $assignedSpecId = $specs[$specIndex] ?? $specs[0];

            // 5. Create Students with OVERRIDES
            Student::factory()->count(rand(3, 4))->create([
                'group_id' => $group->id,      // Force them into this loop's group
                'section'  => $realSection,    // Force section to match the adviser's section
                'spec_id'  => $assignedSpecId, // Force consistent specialization
            ]);
        }
    }
}
