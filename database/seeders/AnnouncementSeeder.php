<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Semester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 random announcements
        Announcement::factory()->count(10)->create();
    }
}
