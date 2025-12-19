<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RubricLevelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $data = [];

        // --- RUBRIC 1: RESEARCH & INVESTIGATION SKILLS ---
        $rubric1 = [
            // Problem Understanding
            1 => [
                1 => 'Demonstrates limited understanding of the problem or lacks awareness of key factors and background.',
                2 => 'Partially understands the problem but may have gaps in knowledge or limited awareness of key factors and background.',
                3 => 'Demonstrates a good understanding of problems. Identifies key factors and background.',
                4 => 'Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background.'
            ],
            // Research Design
            2 => [
                1 => 'Design analysis with inconsistency. Lacks attention to variables and controls.',
                2 => 'Design analysis with some consistency but with gaps. Includes key variables and controls.',
                3 => 'Design analysis with a clear purpose, correct variables, and controls. Ensures the method is valid and reliable.',
                4 => 'Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details.'
            ],
            // Data Collection and Analysis
            3 => [
                1 => 'Collects and analyzes data with limited accuracy. Fails to use appropriate tools or techniques.',
                2 => 'Collects and analyzes data with some accuracy but with lack of consistency. Uses appropriate tools and techniques.',
                3 => 'Collects and analyzes data accurately. Uses appropriate tools and techniques effectively.',
                4 => 'Collects and analyzes data thoroughly, ensuring accuracy. Display exceptional use of advanced tools and techniques.'
            ]
        ];

        // --- RUBRIC 2: TEAMWORK & LEADERSHIP ---
        $rubric2 = [
            4 => [ // Individual Contribution
                1 => 'Minimal contributions to team activities. Lacks initiative to fulfil responsibility.',
                2 => 'Some contributions to team activities. Shows limited initiative, need occasional guidance.',
                3 => 'Significant contributions to team activities. Takes initiative and fulfills individual responsibilities.',
                4 => 'Exceptional contributions to team activities. Display leadership, initiative and consistencies, fulfill individual responsibilities.'
            ]
        ];

        // --- RUBRIC 3: ENGINEERING PROBLEM ANALYSIS ---
        $rubric3 = [
            // Problem Identification
            5 => [
                1 => 'Struggles to identify or define problems. Lacks understanding of problem background.',
                2 => 'Partially identifies problems but lacks clarity or precision. Shows limited understanding of problem background.',
                3 => 'Clearly identifies and defines problems. Demonstrates a good understanding of problem background.',
                4 => 'Skillfully identifies and defines problems. Shows exceptional understanding of problem background.'
            ],
            // Problem Formulation
            6 => [
                1 => 'Formulates problems with limited specificity or lacks focus. Does not consider relevant variables or constraints.',
                2 => 'Formulates problems with some specificity but lacks precision or may overlook certain variables or constraints.',
                3 => 'Formulates problems with clarity and specificity. Considers relevant variables and constraints appropriately.',
                4 => 'Formulates problems precisely and comprehensively. Identifies and incorporates all relevant variables and constraints.'
            ],
            // Research Literature
            7 => [
                1 => 'Shows limited ability to research and gather relevant literature.',
                2 => 'Displays some ability to research and gather literature with inconsistency.',
                3 => 'Research and gather relevant literature effectively. Shows good strength of references.',
                4 => 'Research and gather comprehensive literature from credible sources. Displays exceptional strength of references.'
            ]
        ];

        // --- RUBRIC 4: ENGINEERING COMMUNICATION ---
        $rubric4 = [
            // Technical Content Comprehension
            8 => [
                1 => 'Display limited understanding of activities. Struggles to comprehend content or terminology.',
                2 => 'Shows some understanding of activities but requires clarification or explanation of content or terminology.',
                3 => 'Displays a good understanding of activities. Comprehend content and terminology.',
                4 => 'Displays exceptional understanding of activities. Comprehend content and terminology with ease and fluency.'
            ],
            // Oral Presentation
            9 => [
                1 => 'Delivers oral presentation with limited clarity, coherence or effective use of visual aids.',
                2 => 'Delivers oral presentation with some clarity and coherence. Uses visual aids to some extent.',
                3 => 'Delivers oral presentation with clarity, coherence and effectiveness. Uses visual aids effectively. Displays confidence in public speaking.',
                4 => 'Delivers presentation with exceptional clarity, coherence and effectiveness. Uses visual aids creatively and strategically. Displays exceptional confidence in speaking engagement.'
            ],
            // Documentation
            10 => [
                1 => 'Produces written documentation with limited clarity and organization. Lack of effective use of technical term and formatting.',
                2 => 'Produces written documentation with some clarity and organization. Uses technical term and appropriate formatting to a certain extent.',
                3 => 'Produces written documentation with clarity, organization and coherence. Uses technical language and appropriate formatting effectively.',
                4 => 'Produces written documentation with exceptional clarity, organization and coherence. Uses technical term and appropriate formatting with precision.'
            ]
        ];

        // --- RUBRIC 5: INDEPENDENT & LIFELONG LEARNING ---
        $rubric5 = [
            // Technological Change Awareness
            11 => [ 
                1 => 'Display limited awareness of implication of technological change. Needs understanding of emerging technologies.',
                2 => 'Shows some awareness of technological change but not consistently keep up.',
                3 => 'Displays a good awareness of technological change and keeps up with emerging technologies.',
                4 => 'Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background.'
            ],
            // Independent Learning Preparation
            12 => [ 
                1 => 'Needs preparation and planning for independent learning. May strive to identify learning needs.',
                2 => 'Displays some preparation and planning for independent learning but not consistently identify learning needs.',
                3 => 'Displays effective preparation and planning for independent learning. Identifies learning needs and relevant learning goals.',
                4 => 'Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details.'
            ],
            // Learning Strategies
            13 => [ 
                1 => 'Needs awareness of effective learning strategies. Does not utilize strategies to enhance learning or address challenges.',
                2 => 'Displays some awareness of learning strategies but not consistently use them effectively or adapt to different learning contexts.',
                3 => 'Applies effective learning strategies to enhance learning and address challenges. Displays flexibility in adapting strategies to different learning contexts.',
                4 => 'Applies a wide range of effective learning strategies with consistency and adaptability. Displays exceptional self-aware skills in selecting and adjusting strategies based on learning objectives and contexts.'
            ],
            // Resource Utilization
            14 => [ 
                1 => 'Does not effectively utilize available resources for learning. Needs awareness of relevant resources.',
                2 => 'Utilizes some resources for learning but not fully maximize their potential certain relevant resources.',
                3 => 'Effectively identifies and utilizes available resources for learning. Shows good creativity and seeks out additional resources.',
                4 => 'Displays exceptional ability to identify and utilize a wide range of resources effectively. Shows creativity in seeking out and critically evaluating new resources.'
            ],
            // Continuous Improvement
            15 => [ 
                1 => 'Shows resistance to feedback and limited willingness to make improvements. Does not take proactive steps to enhance skills or knowledge.',
                2 => 'Displays some openness to feedback and makes occasional upgrades. Takes limited initiative in enhancing skills or knowledge.',
                3 => 'Shows openness to feedback and actively seeks opportunities for improvement. Takes initiative in enhancing skills or knowledge based on feedback and self-reflection.',
                4 => 'Embraces feedback with enthusiasm and actively seeks continuous improvement opportunities. Takes proactive and deliberate measures to enhance skills, knowledge, and professional development.'
            ]
        ];

        // Combine all
        $allRubrics = $rubric1 + $rubric2 + $rubric3 + $rubric4 + $rubric5;

        foreach ($allRubrics as $rubricId => $indicators) {
            foreach ($indicators as $pi => $desc) {
                $data[] = [
                    'rubrics_id'            => $rubricId,
                    'performance_indicator' => $pi,
                    'description'           => $desc,
                    'created_at'            => $now,
                    'updated_at'            => $now,
                ];
            }
        }

        DB::table('tbl_rubric_levels')->insert($data);
    }
}
