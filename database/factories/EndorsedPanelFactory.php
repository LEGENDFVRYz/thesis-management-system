<?php

namespace Database\Factories;

use App\Models\DefenseMatrix;
use App\Models\FacultyAssignment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EndorsedPanel>
 */
class EndorsedPanelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // These will usually be overridden by the seeder logic
            'defense_matrix_id' => DefenseMatrix::factory(),
            'panel_id'          => FacultyAssignment::factory(),
            'is_confirmed'      => $this->faker->boolean(50), 
        ];
    }
}
