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
            ['id' => 1, 'criteria_id' => 1, 'performance_indicator' => 'Problem Understanding', 'created_at' => $now],
            ['id' => 2, 'criteria_id' => 1, 'performance_indicator' => 'Research Design', 'created_at' => $now],
            ['id' => 3, 'criteria_id' => 1, 'performance_indicator' => 'Data Collection and Analysis', 'created_at' => $now],

            // Criteria 2: Teamwork & Leadership
            ['id' => 4, 'criteria_id' => 2, 'performance_indicator' => 'Individual Contribution', 'created_at' => $now],

            // Criteria 3: Engineering Problem Analysis
            ['id' => 5, 'criteria_id' => 3, 'performance_indicator' => 'Problem Identification', 'created_at' => $now],
            ['id' => 6, 'criteria_id' => 3, 'performance_indicator' => 'Problem Formulation', 'created_at' => $now],
            ['id' => 7, 'criteria_id' => 3, 'performance_indicator' => 'Research Literature', 'created_at' => $now],

            // Criteria 4: Engineering Communication
            ['id' => 8, 'criteria_id' => 4, 'performance_indicator' => 'Technical Content Comprehension', 'created_at' => $now],
            ['id' => 9, 'criteria_id' => 4, 'performance_indicator' => 'Oral Presentation', 'created_at' => $now],
            ['id' => 10, 'criteria_id' => 4, 'performance_indicator' => 'Documentation', 'created_at' => $now],

            // Criteria 5: Independent & Lifelong Learning
            ['id' => 11, 'criteria_id' => 5, 'performance_indicator' => 'Technological Change Awareness', 'created_at' => $now],
            ['id' => 12, 'criteria_id' => 5, 'performance_indicator' => 'Independent Learning Preparation', 'created_at' => $now],
            ['id' => 13, 'criteria_id' => 5, 'performance_indicator' => 'Learning Strategies', 'created_at' => $now],
            ['id' => 14, 'criteria_id' => 5, 'performance_indicator' => 'Resource Utilization', 'created_at' => $now],
            ['id' => 15, 'criteria_id' => 5, 'performance_indicator' => 'Continuous improvement', 'created_at' => $now],
        ];

        DB::table('tbl_grading_rubrics')->insert($subCriteria);
    }
}
