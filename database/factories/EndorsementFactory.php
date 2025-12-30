<?php

namespace Database\Factories;

use App\Models\Theses;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Endorsement>
 */
class EndorsementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Safety Net: Pick a random thesis if run standalone
            'thesis_id' => Theses::inRandomOrder()->first()?->id ?? Theses::factory(),

            'is_adviser_approved'     => $this->faker->boolean(95),
            'is_coordinator_approved' => $this->faker->boolean(80), 
        ];
    }
}
