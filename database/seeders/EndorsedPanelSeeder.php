<?php

namespace Database\Seeders;

use App\Models\DefenseMatrix;
use App\Models\EndorsedPanel;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EndorsedPanelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Eager load necessary relationships
        $schedules = DefenseMatrix::with([
            'endorsement.thesis.proposal.group.sectionAdviser.assignment'
        ])->get();

        $panelistRoleId = FacultyRole::where('role_name', 'Panelist')->value('id');

        foreach ($schedules as $schedule) {
            // 1. Trace the School Year
            $adviserAssignment = $schedule->endorsement?->thesis?->proposal?->group?->sectionAdviser?->assignment;

            if (!$adviserAssignment) continue; // Skip if broken data

            $targetSyId = $adviserAssignment->sy_id;

            // 2. Find Valid Panelists for this specific SY
            $validPanelists = FacultyAssignment::where('role_id', $panelistRoleId)
                ->where('sy_id', $targetSyId)
                ->where('is_active', true)
                ->where('faculty_id', '!=', $adviserAssignment->faculty_id) // Exclude Adviser
                ->inRandomOrder()
                ->get()
                ->unique('faculty_id'); // Ensure unique distinct physical people

            if ($validPanelists->count() < 3) continue;

            // 3. Invite 3 Panelists (All confirm for simplicity in seed data)
            $candidates = $validPanelists->take(3);

            foreach ($candidates as $panelist) {
                EndorsedPanel::firstOrCreate([
                    'defense_matrix_id' => $schedule->id,
                    'panel_id'          => $panelist->id,
                ], [
                    'is_confirmed'      => true,
                ]);
            }
        }
    }
}
