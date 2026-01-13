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
        // 1. Get all Defense Schedules
        $schedules = DefenseMatrix::with([
            // Eager load the chain to get to the Adviser's Faculty Assignment
            'endorsement.thesis.proposal.group.sectionAdviser.assignment'
        ])->get();

        // Get the Panelist Role ID once
        $panelistRoleId = FacultyRole::where('role_name', 'Panelist')->value('id');

        if (!$panelistRoleId) {
            $this->command->error("Panelist role not found in database.");
            return;
        }

        foreach ($schedules as $schedule) {
            
            // 2. Identify the School Year (sy_id) of this specific defense group
            // Path: DefenseMatrix -> Endorsement -> Thesis -> Proposal -> Group -> SectionAdviser -> FacultyAssignment
            $adviserAssignment = $schedule->endorsement?->thesis?->proposal?->group?->sectionAdviser?->assignment;

            if (!$adviserAssignment) {
                $this->command->warn("Skipping Schedule ID {$schedule->id}: Could not trace Adviser Assignment.");
                continue;
            }

            $targetSyId = $adviserAssignment->sy_id;

            // 3. Query Panelists matching ONLY this sy_id
            $validPanelists = FacultyAssignment::query()
                ->where('role_id', $panelistRoleId)
                ->where('sy_id', $targetSyId) // <--- CRITICAL FIX: Match the batch
                ->where('is_active', true)
                // Exclude the adviser themselves from being a panelist (Conflict of Interest)
                ->where('faculty_id', '!=', $adviserAssignment->faculty_id) 
                ->inRandomOrder()
                ->get();

            // 4. Ensure Unique Physical Faculties
            // (If a faculty has 2 active panelist roles in same SY for some reason, pick unique faculty_id)
            $uniquePanelists = $validPanelists->unique('faculty_id');

            if ($uniquePanelists->count() < 3) {
                // Optional: Fallback or skip if not enough panelists exist for this specific SY
                // $this->command->info("Not enough panelists for SY ID: {$targetSyId}. Skipping.");
                continue;
            }

            // 5. Pick 3-5 random candidates
            $candidates = $uniquePanelists->take(rand(3, 5));

            $confirmedCount = 0;

            foreach ($candidates as $panelist) {
                
                // Logic: The first 3 ALWAYS confirm. The rest reject.
                $shouldConfirm = ($confirmedCount < 3);

                EndorsedPanel::create([
                    'defense_matrix_id' => $schedule->id,
                    'panel_id'          => $panelist->id, // This ID is now guaranteed to match the SY
                    'is_confirmed'      => $shouldConfirm,
                ]);

                if ($shouldConfirm) {
                    $confirmedCount++;
                }
            }
        }
    }
}
