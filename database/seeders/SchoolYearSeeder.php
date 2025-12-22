<?php

namespace Database\Seeders;

use App\Models\SchoolYear;
use App\Models\Semester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ==========================================
        // 1. PAST YEAR (SY 2024-2025)
        // ==========================================
        $sy2024 = SchoolYear::create([
            'year'        => 2024,
            'start_date'  => '2024-08-01',
            'end_date'    => '2025-05-30',
            'archived_at' => '2025-06-01',
        ]);

        Semester::create([
            'school_year_id' => $sy2024->id,
            'semester'       => 0, // 1st Sem
            'start_date'     => '2024-08-01',
            'end_date'       => '2024-12-31',
            'is_active'      => false,
        ]);

        Semester::create([
            'school_year_id' => $sy2024->id,
            'semester'       => 1, // 2nd Sem
            'start_date'     => '2025-01-15',
            'end_date'       => '2025-05-30',
            'is_active'      => false,
        ]);

        // ==========================================
        // 2. CURRENT YEAR (SY 2025-2026)
        // ==========================================
        $sy2025 = SchoolYear::create([
            'year'        => 2025,
            'start_date'  => '2025-08-01',
            'end_date'    => '2026-05-30',
            'archived_at' => null,
        ]);

        // 1st Sem (Finished)
        Semester::create([
            'school_year_id' => $sy2025->id,
            'semester'       => 0, 
            'start_date'     => '2025-08-01',
            'end_date'       => '2025-12-31',
            'is_active'      => false,
        ]);

        // 2nd Sem (ACTIVE NOW)
        // This is the single flag that drives the whole system
        Semester::create([
            'school_year_id' => $sy2025->id,
            'semester'       => 1, 
            'start_date'     => '2026-01-15',
            'end_date'       => '2026-05-30',
            'is_active'      => true, // <--- HERE IS THE FLAG
        ]);

        $this->command->info("Seeded SY 2024 and SY 2025. Active Semester is SY2025-2nd Sem.");
    }
}
