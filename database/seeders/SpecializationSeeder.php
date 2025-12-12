<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Specialization;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specs = [
            'Big Data Analytics', 
            'Machine Learning', 
            'Mechatronics',
            'Networking',
            'System Development'
        ];
        
        foreach ($specs as $spec) {
            Specialization::create([
                'spec_name' => $spec,
            ]);
        }
    }
}
