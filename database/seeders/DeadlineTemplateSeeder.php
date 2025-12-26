<?php

namespace Database\Seeders;

use App\Models\DeadlineTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeadlineTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            // ============================================================
            // STAGE 1: MOR (Methods of Research) - Based on Image 1
            // ============================================================
            ['stage' => 1, 'name' => 'Approve MOR Proposal Draft', 'desc' => 'Person in Charge: Adviser', 'days' => 3, 'anchor' => 'mor_approve_draft'],
            ['stage' => 1, 'name' => 'Review & Proposal Endorsement', 'desc' => 'Person in Charge: Adviser', 'days' => 3, 'anchor' => 'mor_endorse'],
            ['stage' => 1, 'name' => 'Evaluation of Proposal', 'desc' => 'Person in Charge: Committee', 'days' => 3, 'anchor' => 'mor_evaluate'],
            ['stage' => 1, 'name' => 'Submit Final MOR Manuscript & Documentation', 'desc' => 'Person in Charge: Student', 'days' => 3, 'anchor' => 'mor_submit_final'],
            ['stage' => 1, 'name' => 'MOR Defense Scheduling (Matrix)', 'desc' => 'Person in Charge: Coordinator', 'days' => 3, 'anchor' => 'mor_schedule'],
            ['stage' => 1, 'name' => 'MOR Defense', 'desc' => 'Person in Charge: Panel Member', 'days' => 3, 'anchor' => 'mor_defense'], // <--- Defense Event
            ['stage' => 1, 'name' => 'Approve Revisions (If Required)', 'desc' => 'Person in Charge: Adviser and Panel Member', 'days' => 3, 'anchor' => 'mor_revisions'],

            // ============================================================
            // STAGE 2: DP1 (Design Project 1) - Based on Image 2
            // ============================================================
            ['stage' => 2, 'name' => 'Validate DP1 Manuscript', 'desc' => 'Person in Charge: Adviser', 'days' => 3, 'anchor' => 'dp1_validate'],
            ['stage' => 2, 'name' => 'Endorsement for DP1 Defense', 'desc' => 'Person in Charge: Adviser', 'days' => 3, 'anchor' => 'dp1_endorse'],
            ['stage' => 2, 'name' => 'Verify DP1 Endorsement', 'desc' => 'Person in Charge: Coordinator', 'days' => 3, 'anchor' => 'dp1_verify'],
            ['stage' => 2, 'name' => 'Submit Revised DP1 Manuscript & Documentation', 'desc' => 'Person in Charge: Student', 'days' => 3, 'anchor' => 'dp1_submit_revised'],
            ['stage' => 2, 'name' => 'DP1 Defense Scheduling (Matrix)', 'desc' => 'Person in Charge: Coordinator', 'days' => 3, 'anchor' => 'dp1_schedule'],
            ['stage' => 2, 'name' => 'DP1 Defense', 'desc' => 'Person in Charge: Panel Member', 'days' => 3, 'anchor' => 'dp1_defense'], // <--- Defense Event
            ['stage' => 2, 'name' => 'Approve Required Revisions', 'desc' => 'Person in Charge: Adviser and Panel Member', 'days' => 3, 'anchor' => 'dp1_revisions'],
            ['stage' => 2, 'name' => 'Feasibility Validation', 'desc' => 'Person in Charge: Adviser and Panel Member', 'days' => 3, 'anchor' => 'dp1_feasibility'],

            // ============================================================
            // STAGE 3: DP2 (Design Project 2) - Based on Image 3
            // ============================================================
            ['stage' => 3, 'name' => 'Validate DP2 Manuscript', 'desc' => 'Person in Charge: Adviser', 'days' => 3, 'anchor' => 'dp2_validate'],
            ['stage' => 3, 'name' => 'Endorsement for DP2 Defense', 'desc' => 'Person in Charge: Adviser', 'days' => 3, 'anchor' => 'dp2_endorse'],
            ['stage' => 3, 'name' => 'Verify DP2 Endorsement', 'desc' => 'Person in Charge: Coordinator', 'days' => 3, 'anchor' => 'dp2_verify'],
            ['stage' => 3, 'name' => 'Submit Final DP2 Manuscript & Documentation', 'desc' => 'Person in Charge: Student', 'days' => 3, 'anchor' => 'dp2_submit_final'],
            ['stage' => 3, 'name' => 'DP2 Defense Scheduling (Matrix)', 'desc' => 'Person in Charge: Coordinator', 'days' => 3, 'anchor' => 'dp2_schedule'],
            ['stage' => 3, 'name' => 'DP2 Final Defense', 'desc' => 'Person in Charge: Panel Member', 'days' => 3, 'anchor' => 'dp2_defense'], // <--- Defense Event
            ['stage' => 3, 'name' => 'Approve Post-Defense Revisions', 'desc' => 'Person in Charge: Adviser and Panel Member', 'days' => 3, 'anchor' => 'dp2_revisions'],
            ['stage' => 3, 'name' => 'Validate Output Submission', 'desc' => 'Person in Charge: Panel Member', 'days' => 3, 'anchor' => 'dp2_validate_output'],
        ];

        foreach ($templates as $t) {
            DeadlineTemplate::firstOrCreate(
                ['anchor' => $t['anchor']], 
                [
                    'stage'       => $t['stage'],
                    'name'        => $t['name'],
                    'description' => $t['desc'],
                    'duration'    => $t['days'],
                ]
            );
        }
    }
}
