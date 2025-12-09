<?php

namespace Database\Factories;

use App\Models\Faculty;
use App\Models\FacultyRole;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FacultyAssignment>
 */
class FacultyAssignmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = fake()->numberBetween(2020, 2025);

        return [
            'faculty_id' => Faculty::factory(),
            'role_id' => FacultyRole::factory(),
            'school_year' => $year,
            'is_active' => fake()->boolean(90),
        ];
    }
}