<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Faculty;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Availability>
 */
class AvailabilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'faculty_id'      => Faculty::factory(),
            'defense_week_id' => Event::factory(), // Links to the defense event
            'start_date'      => now(),
            'end_date'        => now()->addHours(8),
        ];
    }
}
