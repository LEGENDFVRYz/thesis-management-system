<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\ThesisGroup;
use App\Models\Specialization;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'student']),

            // Randomly assign to an existing thesis group 
            'group_id' => ThesisGroup::inRandomOrder()->first()?->id,
            // Randomly assign a specialization
            'spec_id' => Specialization::inRandomOrder()->first()->id,

            // Personal Data
            'last_name'   => $this->faker->lastName(),
            'first_name'  => $this->faker->firstName(),
            'middle_name' => $this->faker->optional()->lastName(),
            'suffix'      => $this->faker->optional()->suffix(),
            'section'     => $this->faker->numberBetween(1, 7),
            'is_leader'   => $this->faker->boolean(20),
        ];
    }
}