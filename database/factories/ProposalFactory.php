<?php

namespace Database\Factories;

use App\Models\ThesisGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Proposal>
 */
class ProposalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 1. Link to an existing group
            'group_id' => ThesisGroup::inRandomOrder()->first()?->id,
                // ?? ThesisGroup::factory(),

            'proposal_title' => $this->faker->sentence(6), // e.g., "Automated Solar Powered..."

            'proposal_filepath' => 'proposals/group_' . $this->faker->numberBetween(1, 100) . '_title.pdf',

            'is_pursued' => false,
        ];
    }
}
