<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolYear>
 */
class SchoolYearFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Default to a random future year if not specified
        $year = $this->faker->unique()->numberBetween(2024, 2025);
        
        return [
            'year'        => $year,
            'start_date'  => "$year-08-01", // Starts August
            'end_date'    => ($year + 1) . "-05-30", // Ends May next year
            'archived_at' => null,
        ];
    }
}
