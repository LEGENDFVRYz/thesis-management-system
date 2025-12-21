<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArchivedJournal>
 */
class ArchivedJournalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // thesis_id is handled by the Seeder logic
            
            'file_path' => 'archives/' . $this->faker->year . '/journal_' . $this->faker->uuid() . '.pdf',
            
            // Random size e.g. 1.45 MB
            'file_size' => $this->faker->randomFloat(2, 0.5, 5.0), 
            
            // Generate keywords from random words
            'keywords' => implode(', ', $this->faker->words(3)),
            
            'created_at' => now(),
        ];
    }
}
