<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Faculty>
 */
class FacultyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Automatically create a User when a Faculty is created
            'user_id' => User::factory()->state([
                'role' => 'faculty',                            // Force role to be 'faculty'
            ]),
            'name_prefix' => fake()->randomElement(['Dr.', 'Engr.', 'Prof.']),
            'last_name' => fake()->lastName(),
            'first_name' => fake()->firstName(),
            
            'middle_name' => fake()->optional()->lastName(),
            'is_regular' => fake()->boolean(),
        ];
    }
}
