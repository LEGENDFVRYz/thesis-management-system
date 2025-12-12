<?php

namespace Database\Factories;

use App\Models\SectionAdviser;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ThesisGroup>
 */
class ThesisGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section_adviser_id' => SectionAdviser::inRandomOrder()->first()->id,
                // ?? SectionAdviser::factory(),

            'group_number' => $this->faker->numberBetween(1, 11),
        ];
    }
}
