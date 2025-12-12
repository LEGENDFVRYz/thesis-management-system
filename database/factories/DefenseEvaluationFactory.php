<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DefenseEvaluation>
 */
class DefenseEvaluationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Randomize a grade between 70 and 100
        $grade = $this->faker->randomFloat(2, 70, 99);

        // Determine remark based on grade
        $remarks = match(true) {
            $grade >= 96 => 'Approved without Revisions',
            $grade >= 85 => 'Approved with Minor Revisions',
            $grade >= 75 => 'Approved with Major Revisions',
            default => 'Re-Defense Required',
        };

        return [
            // IDs are handled by the Seeder
            'grade' => $grade,
            'comment' => $this->faker->sentence(10),
            'remarks' => $remarks,
        ];
    }
}
