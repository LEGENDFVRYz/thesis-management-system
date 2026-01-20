<?php

namespace Database\Seeders;

use App\Models\DefenseMatrix;
use App\Models\Endorsement;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefenseMatrixSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Only schedule defenses for FULLY APPROVED endorsements
        $approvedEndorsements = Endorsement::where('is_adviser_approved', true)
            ->where('is_coordinator_approved', true)
            ->orderBy('created_at', 'asc') 
            ->get()
            ->groupBy('thesis_id');

        foreach ($approvedEndorsements as $thesisId => $endorsements) {
            
            $items = $endorsements->values();
            $count = $items->count();

            foreach ($items as $index => $endorsement) {
                
                // Skip if schedule already exists
                if (DefenseMatrix::where('endorsement_id', $endorsement->id)->exists()) continue;

                $course = 'MOR'; // Default
                $scheduleDate = null;

                // --- 4TH YEAR SCENARIO (3 Items: MOR -> DP1 -> DP2) ---
                if ($count >= 3) {
                    if ($index == 0) { 
                        $course = 'MOR'; 
                        $scheduleDate = Carbon::parse($endorsement->created_at)->addWeeks(2);
                    } 
                    elseif ($index == 1) { 
                        $course = 'DP1'; 
                        $scheduleDate = Carbon::parse($endorsement->created_at)->addWeeks(2);
                    } 
                    else { 
                        // Index 2 or higher is DP2
                        $course = 'DP2'; 
                        $isDone = rand(0, 1);
                        $scheduleDate = $isDone ? Carbon::now()->subDays(rand(1, 3)) : Carbon::now()->addDays(rand(2, 10));
                    }
                }
                // --- 3RD YEAR SCENARIO (1 Item: MOR) ---
                elseif ($count == 1) {
                    $course = 'MOR';
                    $isDone = rand(0, 1);
                    $scheduleDate = $isDone ? Carbon::now()->subDays(rand(1, 3)) : Carbon::now()->addDays(rand(2, 10));
                }
                // --- EDGE CASE: 2 Items (Assume MOR -> DP1) ---
                elseif ($count == 2) {
                    if ($index == 0) {
                        $course = 'MOR';
                        $scheduleDate = Carbon::parse($endorsement->created_at)->addWeeks(2);
                    } else {
                        $course = 'DP1';
                        // Treat DP1 as "Current" in this edge case
                        $isDone = rand(0, 1);
                        $scheduleDate = $isDone ? Carbon::now()->subDays(rand(1, 3)) : Carbon::now()->addDays(rand(2, 10));
                    }
                }

                // *** CRITICAL FIX: Safety Check ***
                // If date is still null (logic gap), skip this record to prevent crash
                if (!$scheduleDate) {
                    continue;
                }

                // Random Time (8AM - 4PM)
                $scheduleDate = $scheduleDate->copy()->setTime(rand(8, 16), 0);

                DefenseMatrix::create([
                    'endorsement_id'   => $endorsement->id,
                    'course'           => $course,
                    'defense_schedule' => $scheduleDate,
                    'defense_room'     => rand(301, 305),
                    'created_at'       => $endorsement->created_at,
                    'updated_at'       => $endorsement->created_at,
                ]);
            }
        }
    }
}
