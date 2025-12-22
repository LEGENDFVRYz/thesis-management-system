<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GradingCriteriasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        DB::table('tbl_grading_criterias')->insert([
            ['id' => 1, 'category' => 'Research & Investigation Skills', 'weight' => 20.0, 'minimum' => 15, 'created_at' => $now],
            ['id' => 2, 'category' => 'Teamwork & Leadership', 'weight' => 20.0, 'minimum' => 15, 'created_at' => $now],
            ['id' => 3, 'category' => 'Engineering Problem Analysis', 'weight' => 20.0, 'minimum' => 15, 'created_at' => $now],
            ['id' => 4, 'category' => 'Engineering Communication', 'weight' => 20.0, 'minimum' => 15, 'created_at' => $now],
            ['id' => 5, 'category' => 'Independent & Lifelong Learning', 'weight' => 20.0, 'minimum' => 15, 'created_at' => $now],
        ]);
    }
}
