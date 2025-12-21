<?php

namespace Database\Factories;

use App\Models\Proposal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Theses>
 */
class ThesesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /// Safety Net: If run standalone, pick a random pursued proposal.
            'proposal_id' => Proposal::where('is_pursued', true)->inRandomOrder()->first()?->id,
                            //  ?? Proposal::factory(), 

            // Logic: Sometimes the title changes slightly from proposal to thesis
            'title' => $this->faker->sentence(6), 

            'manuscript_filepath' => 'theses/manuscript_' . $this->faker->uuid() . '.pdf',
        ];
    }
}
