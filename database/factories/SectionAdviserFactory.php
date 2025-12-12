<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Adviser>
 */
class SectionAdviserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section' => $this->faker->numberBetween(1, 7),

            'faculty_assign_id' => FacultyAssignment::factory()->state(function (array $attributes) {
                

                $adviserRole = FacultyRole::where('role_name', 'Adviser')->first();

                return ['role_id' => $adviserRole->id];
            }),
        ];
    }
}
