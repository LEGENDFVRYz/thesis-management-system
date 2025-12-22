<?php

namespace Database\Seeders;

use App\Models\DefenseMatrix;
use App\Models\EndorsedPanel;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EndorsedPanelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get all Defense Schedules
        $schedules = DefenseMatrix::all();

        // 2. Get all valid Panelists
        // We look for assignments that have the 'Panelist' role
        $panelistRole = FacultyRole::where('role_name', 'Panelist')->first();
        
        $availablePanelists = FacultyAssignment::where('role_id', $panelistRole->id)
                                               ->where('is_active', true)
                                               ->get();

        if ($availablePanelists->count() < 5) {
            $this->command->warn("Not enough panelists seeded to run EndorsedPanelSeeder.");
            return;
        }

        foreach ($schedules as $schedule) {
            
            // 3. Pick 3-5 random candidates to be invited
            // shuffle() randomizes the order
            $candidates = $availablePanelists->shuffle()->take(rand(3, 5));

            $confirmedCount = 0;

            foreach ($candidates as $index => $panelist) {
                
                // 4. Logic: The first 3 ALWAYS confirm. The rest reject (false).
                $shouldConfirm = ($confirmedCount < 3);

                EndorsedPanel::create([
                    'defense_matrix_id' => $schedule->id,
                    'panel_id'          => $panelist->id,
                    'is_confirmed'      => $shouldConfirm,
                ]);

                if ($shouldConfirm) {
                    $confirmedCount++;
                }
            }
        }
    }
}
