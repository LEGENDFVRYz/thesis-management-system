<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GradingRubricsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        
        $subCriteria = [
            // Criteria 1: Research & Investigation Skills
            ['id' => 1, 'criteria_id' => 1, 'title' => 'Problem Understanding', 'created_at' => $now],
            ['id' => 2, 'criteria_id' => 1, 'title' => 'Research Design', 'created_at' => $now],
            ['id' => 3, 'criteria_id' => 1, 'title' => 'Data Collection and Analysis', 'created_at' => $now],

            // Criteria 2: Teamwork & Leadership
            ['id' => 4, 'criteria_id' => 2, 'title' => 'Individual Contribution', 'created_at' => $now],

            // Criteria 3: Engineering Problem Analysis
            ['id' => 5, 'criteria_id' => 3, 'title' => 'Problem Identification', 'created_at' => $now],
            ['id' => 6, 'criteria_id' => 3, 'title' => 'Problem Formulation', 'created_at' => $now],
            ['id' => 7, 'criteria_id' => 3, 'title' => 'Research Literature', 'created_at' => $now],

            // Criteria 4: Engineering Communication
            ['id' => 8, 'criteria_id' => 4, 'title' => 'Technical Content Comprehension', 'created_at' => $now],
            ['id' => 9, 'criteria_id' => 4, 'title' => 'Oral Presentation', 'created_at' => $now],
            ['id' => 10, 'criteria_id' => 4, 'title' => 'Documentation', 'created_at' => $now],

            // Criteria 5: Independent & Lifelong Learning
            ['id' => 11, 'criteria_id' => 5, 'title' => 'Technological Change Awareness', 'created_at' => $now],
            ['id' => 12, 'criteria_id' => 5, 'title' => 'Independent Learning Preparation', 'created_at' => $now],
            ['id' => 13, 'criteria_id' => 5, 'title' => 'Learning Strategies', 'created_at' => $now],
            ['id' => 14, 'criteria_id' => 5, 'title' => 'Resource Utilization', 'created_at' => $now],
            ['id' => 15, 'criteria_id' => 5, 'title' => 'Continuous improvement', 'created_at' => $now],
        ];

        DB::table('tbl_grading_rubrics')->insert($subCriteria);
    }
}
