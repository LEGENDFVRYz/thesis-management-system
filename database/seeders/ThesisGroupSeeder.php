<?php

namespace Database\Seeders;

use App\Models\ThesisGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ThesisGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ThesisGroup::factory()->count(20)->create();
    }
}
