<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\ThesisGroup;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get ALL groups
        $groups = ThesisGroup::all();

        // 2. Loop through every single group
        foreach ($groups as $group) {
            
            // 3. Create students strictly for THIS group
            // passing ['group_id' => $group->id] OVERRIDES the random line in your factory
            Student::factory()->count(rand(2, 4))->create([
                'group_id' => $group->id 
            ]);
        }
    }
}
