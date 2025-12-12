<?php

namespace Database\Factories;

use App\Models\Theses;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DefenseMatrix>
 */
class DefenseMatrixFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Safety Net: If run standalone, find/create a valid thesis.
            'thesis_id' => Theses::inRandomOrder()->first()?->id ?? Theses::factory(),
            
            'course' => $this->faker->randomElement(['MOR', 'DP1', 'DP2']),
            
            // Schedule defense between next week and next month
            'defense_schedule' => $this->faker->dateTimeBetween('+1 day', '+1 week'),
            
            'defense_room' => $this->faker->numberBetween(300, 316),
        ];
    }
}
