<?php

namespace Database\Factories;

use App\Models\SchoolYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Semester>
 */
class SemesterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'school_year_id' => SchoolYear::factory(),
            'semester'       => 0, // 0 = 1st Sem, 1 = 2nd Sem (Placeholder)
            'start_date'     => now(),
            'end_date'       => now()->addMonths(5),
            'is_active'   => false, // Default to inactive
        ];
    }
}
