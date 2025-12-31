<?php

namespace Database\Seeders;

use App\Models\DeadlineTemplate;
use DB;
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
            // STAGE 1: MOR (Methods of Research)
            // ============================================================
            ['stage' => 1, 'sort_order' => 1, 'name' => 'MOR Proposal Draft', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Submit initial proposal document.'],
            ['stage' => 1, 'sort_order' => 1, 'name' => 'MOR Proposal Draft', 'role' => 'Adviser', 'type' => 'approval', 'days' => 3, 'description' => 'Review proposal draft.'],
            
            ['stage' => 1, 'sort_order' => 2, 'name' => 'Proposal Evaluation', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Submit initial proposal document.'],
            ['stage' => 1, 'sort_order' => 2, 'name' => 'Proposal Evaluation', 'role' => 'Committee', 'type' => 'evaluation', 'days' => 3, 'description' => 'Evaluate proposal content.'],
            
            ['stage' => 1, 'sort_order' => 3, 'name' => 'Endorsement', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Request endorsement for defense.'],
            ['stage' => 1, 'sort_order' => 3, 'name' => 'Endorsement', 'role' => 'Adviser', 'type' => 'approval', 'days' => 3, 'description' => 'Endorse student for defense.'],
            ['stage' => 1, 'sort_order' => 3, 'name' => 'Endorsement', 'role' => 'Coordinator', 'type' => 'approval', 'days' => 3, 'description' => 'Verify endorsement prerequisites.'],
            
            ['stage' => 1, 'sort_order' => 4, 'name' => 'Pre-Defense (MOR)', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Submit Final MOR Manuscript & Documentation'],
            ['stage' => 1, 'sort_order' => 4, 'name' => 'Pre-Defense (MOR)', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'description' => 'Review final manuscript quality.'],
            ['stage' => 1, 'sort_order' => 4, 'name' => 'Pre-Defense (MOR)', 'role' => 'Coordinator', 'type' => 'schedule', 'days' => 3, 'description' => 'Defense Matrix (Schedule)'],
            
            ['stage' => 1, 'sort_order' => 5, 'name' => 'MOR Defense', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Present project to panel.'],
            ['stage' => 1, 'sort_order' => 5, 'name' => 'MOR Defense', 'role' => 'Panelist', 'type' => 'evaluation', 'days' => 3, 'description' => 'Evaluate defense presentation.'],
            ['stage' => 1, 'sort_order' => 5, 'name' => 'MOR Defense', 'role' => 'Adviser', 'type' => 'evaluation', 'days' => 3, 'description' => 'Sit in defense and grade student.'],
            
            ['stage' => 1, 'sort_order' => 6, 'name' => 'Post-Defense', 'role' => 'Student', 'type' => 'agreement', 'days' => 3, 'description' => 'Submit revised manuscript based on feedback.'],
            ['stage' => 1, 'sort_order' => 6, 'name' => 'Post-Defense', 'role' => 'Adviser', 'type' => 'grading', 'days' => 3, 'description' => 'Validate revisions and finalize grade.'],

            // ============================================================
            // STAGE 2: DP1 (Design Project 1)
            // ============================================================
            ['stage' => 2, 'sort_order' => 7, 'name' => 'Work Proper', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Submit Revision and Work Progress'],
            ['stage' => 2, 'sort_order' => 7, 'name' => 'Work Proper', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'description' => 'Review and Critic Students Progress'],
            
            ['stage' => 2, 'sort_order' => 8, 'name' => 'Endorsement', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Submit Revised DP1 Manuscript & Documentation'],
            ['stage' => 2, 'sort_order' => 8, 'name' => 'Endorsement', 'role' => 'Adviser', 'type' => 'approval', 'days' => 3, 'description' => 'Validate DP1 Manuscript and Compliance (50%)'],
            ['stage' => 2, 'sort_order' => 8, 'name' => 'Endorsement', 'role' => 'Coordinator', 'type' => 'approval', 'days' => 3, 'description' => 'Verify Endorsement'],
            
            ['stage' => 2, 'sort_order' => 9, 'name' => 'Pre-Defense (DP1)', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Submit Final DP1 Manuscript & Documentation'],
            ['stage' => 2, 'sort_order' => 9, 'name' => 'Pre-Defense (DP1)', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'description' => 'Review final manuscript quality.'],
            ['stage' => 2, 'sort_order' => 9, 'name' => 'Pre-Defense (DP1)', 'role' => 'Coordinator', 'type' => 'schedule', 'days' => 3, 'description' => 'Defense Matrix (Schedule)'],
            
            ['stage' => 2, 'sort_order' => 10, 'name' => 'DP1 Defense', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Present project to panel.'],
            ['stage' => 2, 'sort_order' => 10, 'name' => 'DP1 Defense', 'role' => 'Panelist', 'type' => 'evaluation', 'days' => 3, 'description' => 'Evaluate defense presentation.'],
            ['stage' => 2, 'sort_order' => 10, 'name' => 'DP1 Defense', 'role' => 'Adviser', 'type' => 'evaluation', 'days' => 3, 'description' => 'Sit in defense and grade student.'],
            
            ['stage' => 2, 'sort_order' => 11, 'name' => 'Post-Defense', 'role' => 'Student', 'type' => 'agreement', 'days' => 3, 'description' => 'Submit revised manuscript based on feedback.'],
            ['stage' => 2, 'sort_order' => 11, 'name' => 'Post-Defense', 'role' => 'Adviser', 'type' => 'grading', 'days' => 3, 'description' => 'Grading and Feasibility Validation'],

            // ============================================================
            // STAGE 3: DP2 (Design Project 2)
            // ============================================================
            ['stage' => 3, 'sort_order' => 12, 'name' => 'Work Proper', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Submit Revision and Work Progress for DP2'],
            ['stage' => 3, 'sort_order' => 12, 'name' => 'Work Proper', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'description' => 'Review and Critic Students Progress'],
            
            ['stage' => 3, 'sort_order' => 13, 'name' => 'Endorsement', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Submit Revised DP2 Manuscript & Documentation'],
            ['stage' => 3, 'sort_order' => 13, 'name' => 'Endorsement', 'role' => 'Adviser', 'type' => 'approval', 'days' => 3, 'description' => 'Validate DP2 Manuscript and Compliance (100%)'],
            ['stage' => 3, 'sort_order' => 13, 'name' => 'Endorsement', 'role' => 'Coordinator', 'type' => 'approval', 'days' => 3, 'description' => 'Verify Endorsement'],
            
            ['stage' => 3, 'sort_order' => 14, 'name' => 'DP2 Defense', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Present project to panel.'],
            ['stage' => 3, 'sort_order' => 14, 'name' => 'DP2 Defense', 'role' => 'Panelist', 'type' => 'evaluation', 'days' => 3, 'description' => 'Evaluate defense presentation.'],
            ['stage' => 3, 'sort_order' => 14, 'name' => 'DP2 Defense', 'role' => 'Adviser', 'type' => 'evaluation', 'days' => 3, 'description' => 'Sit in defense and grade student.'],
            
            ['stage' => 3, 'sort_order' => 15, 'name' => 'Post-Defense', 'role' => 'Student', 'type' => 'agreement', 'days' => 3, 'description' => 'Submit revised manuscript based on feedback.'],
            ['stage' => 3, 'sort_order' => 15, 'name' => 'Post-Defense', 'role' => 'Adviser', 'type' => 'grading', 'days' => 3, 'description' => 'Confirm Completion'],
            ['stage' => 3, 'sort_order' => 15, 'name' => 'Post-Defense', 'role' => 'Awardee', 'type' => 'evaluation', 'days' => 3, 'description' => 'Best Thesis Project Nomination / Awarding'],
            
            ['stage' => 3, 'sort_order' => 16, 'name' => 'Finalization', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'description' => 'Final Requirements'],
            ['stage' => 3, 'sort_order' => 16, 'name' => 'Finalization', 'role' => 'Panelist', 'type' => 'approval', 'days' => 3, 'description' => 'Signatory for approval sheet of completion'],
            ['stage' => 3, 'sort_order' => 16, 'name' => 'Finalization', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'description' => 'Release Clearance'],
        ];

        // Insert (Fixed even values, -- not editable yet)
        DB::table('tbl_deadline_templates')->insert($templates);
    }
}
