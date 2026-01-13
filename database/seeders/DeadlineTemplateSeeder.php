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
        $template = [
            // ============================================================
            // STAGE 1: MOR (Methods of Research)
            // ============================================================
            ['stage' => 1, 'sort_order' => 1, 'name' => 'MOR Proposal Draft', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit initial proposal document.'],
            ['stage' => 1, 'sort_order' => 1, 'name' => 'MOR Proposal Draft', 'role' => 'Adviser', 'type' => 'approval', 'days' => 3, 'desc' => 'Review proposal draft.'],
            
            ['stage' => 1, 'sort_order' => 2, 'name' => 'Proposal Evaluation', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit initial proposal document.'],
            ['stage' => 1, 'sort_order' => 2, 'name' => 'Proposal Evaluation', 'role' => 'Committee', 'type' => 'evaluation', 'days' => 3, 'desc' => 'Evaluate proposal content.'],
            
            ['stage' => 1, 'sort_order' => 3, 'name' => 'Endorsement', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Request endorsement for defense.'],
            ['stage' => 1, 'sort_order' => 3, 'name' => 'Endorsement', 'role' => 'Adviser', 'type' => 'approval', 'days' => 3, 'desc' => 'Endorse student for defense.'],
            ['stage' => 1, 'sort_order' => 3, 'name' => 'Endorsement', 'role' => 'Coordinator', 'type' => 'approval', 'days' => 3, 'desc' => 'Verify endorsement prerequisites.'],
            
            ['stage' => 1, 'sort_order' => 4, 'name' => 'Pre-Defense (MOR)', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit Final MOR Manuscript & Documentation'],
            ['stage' => 1, 'sort_order' => 4, 'name' => 'Pre-Defense (MOR)', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'desc' => 'Review final manuscript quality.'],
            ['stage' => 1, 'sort_order' => 4, 'name' => 'Pre-Defense (MOR)', 'role' => 'Coordinator', 'type' => 'schedule', 'days' => 3, 'desc' => 'Defense Matrix (Schedule)'],
            
            ['stage' => 1, 'sort_order' => 5, 'name' => 'MOR Defense', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Present project to panel.'],
            ['stage' => 1, 'sort_order' => 5, 'name' => 'MOR Defense', 'role' => 'Panelist', 'type' => 'evaluation', 'days' => 3, 'desc' => 'Evaluate defense presentation.'],
            ['stage' => 1, 'sort_order' => 5, 'name' => 'MOR Defense', 'role' => 'Adviser', 'type' => 'evaluation', 'days' => 3, 'desc' => 'Sit in defense and grade student.'],
            
            ['stage' => 1, 'sort_order' => 6, 'name' => 'Post-Defense', 'role' => 'Student', 'type' => 'agreement', 'days' => 3, 'desc' => 'Submit revised manuscript based on feedback.'],
            ['stage' => 1, 'sort_order' => 6, 'name' => 'Post-Defense', 'role' => 'Adviser', 'type' => 'grading', 'days' => 3, 'desc' => 'Validate revisions and finalize grade.'],

            // ============================================================
            // STAGE 2: DP1 (Design Project 1)
            // ============================================================
            ['stage' => 2, 'sort_order' => 7, 'name' => 'Work Proper', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit Revision and Work Progress'],
            ['stage' => 2, 'sort_order' => 7, 'name' => 'Work Proper', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'desc' => 'Review and Critic Students Progress'],
            
            ['stage' => 2, 'sort_order' => 8, 'name' => 'Endorsement', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit Revised DP1 Manuscript & Documentation'],
            ['stage' => 2, 'sort_order' => 8, 'name' => 'Endorsement', 'role' => 'Adviser', 'type' => 'approval', 'days' => 3, 'desc' => 'Validate DP1 Manuscript and Compliance (50%)'],
            ['stage' => 2, 'sort_order' => 8, 'name' => 'Endorsement', 'role' => 'Coordinator', 'type' => 'approval', 'days' => 3, 'desc' => 'Verify Endorsement'],
            
            ['stage' => 2, 'sort_order' => 9, 'name' => 'Pre-Defense (DP1)', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit Final DP1 Manuscript & Documentation'],
            ['stage' => 2, 'sort_order' => 9, 'name' => 'Pre-Defense (DP1)', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'desc' => 'Review DP1 manuscript quality and project feasibility'],
            ['stage' => 2, 'sort_order' => 9, 'name' => 'Pre-Defense (DP1)', 'role' => 'Coordinator', 'type' => 'schedule', 'days' => 3, 'desc' => 'Defense Matrix (Schedule)'],
            
            ['stage' => 2, 'sort_order' => 10, 'name' => 'DP1 Defense', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Present project to panel.'],
            ['stage' => 2, 'sort_order' => 10, 'name' => 'DP1 Defense', 'role' => 'Panelist', 'type' => 'evaluation', 'days' => 3, 'desc' => 'Evaluate defense presentation.'],
            ['stage' => 2, 'sort_order' => 10, 'name' => 'DP1 Defense', 'role' => 'Adviser', 'type' => 'evaluation', 'days' => 3, 'desc' => 'Sit in defense and grade student.'],
            
            ['stage' => 2, 'sort_order' => 11, 'name' => 'Post-Defense', 'role' => 'Student', 'type' => 'agreement', 'days' => 3, 'desc' => 'Submit revised manuscript based on feedback.'],
            ['stage' => 2, 'sort_order' => 11, 'name' => 'Post-Defense', 'role' => 'Adviser', 'type' => 'grading', 'days' => 3, 'desc' => 'Grading and Feasibility Validation'],

            // ============================================================
            // STAGE 3: DP2 (Design Project 2)
            // ============================================================
            ['stage' => 3, 'sort_order' => 12, 'name' => 'Work Proper', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit Revision and Work Progress for DP2'],
            ['stage' => 3, 'sort_order' => 12, 'name' => 'Work Proper', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'desc' => 'Review and Critic Students Progress'],
            
            ['stage' => 3, 'sort_order' => 13, 'name' => 'Endorsement', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit Revised DP2 Manuscript & Documentation'],
            ['stage' => 3, 'sort_order' => 13, 'name' => 'Endorsement', 'role' => 'Adviser', 'type' => 'approval', 'days' => 3, 'desc' => 'Validate DP2 Manuscript and Compliance (100%)'],
            ['stage' => 3, 'sort_order' => 13, 'name' => 'Endorsement', 'role' => 'Coordinator', 'type' => 'approval', 'days' => 3, 'desc' => 'Verify Endorsement'],
            
            ['stage' => 3, 'sort_order' => 14, 'name' => 'Pre-Defense (DP2)', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Submit Final DP2 Manuscript & Project Completion Documentation'],
            ['stage' => 3, 'sort_order' => 14, 'name' => 'Pre-Defense (DP2)', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'desc' => 'Review final manuscript quality and project'],
            ['stage' => 3, 'sort_order' => 14, 'name' => 'Pre-Defense (DP2)', 'role' => 'Coordinator', 'type' => 'schedule', 'days' => 3, 'desc' => 'Defense Matrix (Schedule)'],

            ['stage' => 3, 'sort_order' => 15, 'name' => 'DP2 Defense', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Present project to panel.'],
            ['stage' => 3, 'sort_order' => 15, 'name' => 'DP2 Defense', 'role' => 'Panelist', 'type' => 'evaluation', 'days' => 3, 'desc' => 'Evaluate defense presentation.'],
            ['stage' => 3, 'sort_order' => 15, 'name' => 'DP2 Defense', 'role' => 'Adviser', 'type' => 'evaluation', 'days' => 3, 'desc' => 'Sit in defense and grade student.'],
            
            ['stage' => 3, 'sort_order' => 16, 'name' => 'Post-Defense', 'role' => 'Student', 'type' => 'agreement', 'days' => 3, 'desc' => 'Submit revised manuscript based on feedback.'],
            ['stage' => 3, 'sort_order' => 16, 'name' => 'Post-Defense', 'role' => 'Adviser', 'type' => 'grading', 'days' => 3, 'desc' => 'Confirm Completion'],
            ['stage' => 3, 'sort_order' => 16, 'name' => 'Post-Defense', 'role' => 'Awardee', 'type' => 'evaluation', 'days' => 3, 'desc' => 'Best Thesis Project Nomination / Awarding'],
            
            ['stage' => 3, 'sort_order' => 17, 'name' => 'Finalization', 'role' => 'Student', 'type' => 'submission', 'days' => 3, 'desc' => 'Final Requirements'],
            ['stage' => 3, 'sort_order' => 17, 'name' => 'Finalization', 'role' => 'Panelist', 'type' => 'approval', 'days' => 3, 'desc' => 'Signatory for approval sheet of completion'],
            ['stage' => 3, 'sort_order' => 17, 'name' => 'Finalization', 'role' => 'Adviser', 'type' => 'review', 'days' => 3, 'desc' => 'Release Clearance'],
        ];

        $milestone_desc = [
            '1-1' => 'Initial submission and adviser review of the research proposal.',
            '1-2' => 'Committee assessment of the proposal viability.',
            '1-3' => 'Formal approval from adviser to proceed to defense.',
            '1-4' => 'Final manuscript submission and defense scheduling.',
            '1-5' => 'Oral presentation and defense of the research proposal.',
            '1-6' => 'Revisions based on panel feedback and final grading.',

            '2-7' => 'Development progress monitoring and consultation.',
            '2-8' => 'Validation of DP1 manuscript for defense eligibility.',
            '2-9' => 'Submission of DP1 deliverables and scheduling.',
            '2-10' => 'Presentation of the design and initial prototype.',
            '2-11' => 'Feasibility validation and revision compliance.',

            '3-12' => 'Final development phase and progress updates.',
            '3-13' => 'Validation of complete project manuscript for final defense.',
            '3-14' => 'Final oral defense and project demonstration.',
            '3-15' => 'Completion confirmation and awarding nomination.',
            '3-16' => 'Clearance, binding, and final administrative requirements.',
        ];


        // Main logic: Insert all the data
        foreach ($template as $item) {
            // Pulled the genral description per milestone
            $key = $item['stage'] . '-' . $item['sort_order'];
            $general_desc = $milestone_desc[$key] ?? null;

            // Create or Find the Parent Milestone
            $milestoneId = DB::table('tbl_milestones')
                ->where('stage', $item['stage'])
                ->where('sort_order', $item['sort_order'])
                ->value('id');

            if (!$milestoneId) {
                // If it doesn't exist, create it
                $milestoneId = DB::table('tbl_milestones')->insertGetId([
                    'stage' => $item['stage'],
                    'sort_order' => $item['sort_order'],
                    'name' => $item['name'],
                    'desc' => $general_desc,    // Generic description of the milestone
                    'offset' => 7
                ]);
            }

            // Insert (Role specific) rulings in the deadlines
            DB::table('tbl_deadline_rules')->insert([
                'milestone_id' => $milestoneId,
                'role' => $item['role'],
                'type' => $item['type'],
                'desc' => $item['desc'], 
                'days' => $item['days'],
                'anchor' => null,           // Set to null temporarily
            ]);
        }
    }
}
