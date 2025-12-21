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
        $activeSemester = Semester::where('is_active', true)->first();
        if (!$activeSemester) return;

        $announcements = [
            'Guideline for Thesis Manuscript Formatting',
            'Schedule of Final Defense',
            'Submission of Hardbound Copies',
            'Reminder: Consultation Hours'
        ];

        foreach ($announcements as $index => $title) {
            Announcement::create([
                'semester_id' => $activeSemester->id,
                // 'title'       => $title,
                'due_date'    => now()->addDays(($index + 1) * 5),
            ]);
        }
    }
}
