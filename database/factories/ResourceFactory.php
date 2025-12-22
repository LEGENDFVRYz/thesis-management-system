<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resource>
 */
class ResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Mock file types
        $types = ['pdf', 'docx', 'pptx', 'xlsx'];
        $ext = $this->faker->randomElement($types);

        return [
            'title'         => $this->faker->unique()->sentence(3),
            'description'   => $this->faker->paragraph(),
            
            // Simulating a file path in storage
            'file_path'     => 'resources/' . $this->faker->slug() . '.' . $ext,
            
            'file_type'     => $ext,
            'file_size'     => $this->faker->randomFloat(2, 0.5, 15.0), // Size in MB
            
            // Hardcoded fallback, usually overridden in Seeder
            // '__uploaded_by' => 'Admin User', 
            
            'is_active'     => $this->faker->boolean(90), // 90% chance active
        ];
    }
}
