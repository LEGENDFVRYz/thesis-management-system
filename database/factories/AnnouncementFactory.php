<?php

namespace Database\Factories;

use App\Models\Semester;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ensure we have a semester ID to attach to
        $semesterId = Semester::inRandomOrder()->first()?->id ?? Semester::factory()->create()->id;

        return [
            'semester_id' => $semesterId,
            'subject' => $this->faker->sentence(4), // e.g. "Thesis Defense Schedule Update"
            'priority_level' => $this->faker->randomElement(['Low', 'Medium', 'High', 'Urgent']),
            'message' => $this->faker->paragraph(3),
            'target_audience' => $this->faker->randomElement(['All', 'Student', 'Faculty', 'Adviser']),
        ];
    }
}
