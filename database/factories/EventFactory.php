<?php

namespace Database\Factories;

use App\Models\DeadlineTemplate;
use App\Models\Semester;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'dl_template_id' => DeadlineTemplate::factory(),
            'semester_id'    => Semester::factory(),
            // 'title'          => $this->faker->sentence(), // Usually copied from template
            'due_date'       => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }
}
