<?php

namespace Database\Seeders;

use App\Models\Endorsement;
use App\Models\Theses;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EndorsementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $theses = Theses::with(['proposal.group.sectionAdviser.assignment.schoolYear'])->get();

        if ($theses->isEmpty()) {
            $this->command->info('No Theses found. Skipping Endorsement seeding.');
            return;
        }

        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year') ?? date('Y');

        foreach ($theses as $thesis) {
            
            // Safety Check
            $schoolYear = $thesis->proposal?->group?->sectionAdviser?->assignment?->schoolYear;
            if (!$schoolYear) continue; 

            $batchYear = $schoolYear->year;
            $yearLevel = 3 + ($activeYear - $batchYear);

            // Determine Count (3rd Year = 1, 4th Year = 3)
            $endorsementCount = ($yearLevel >= 4) ? 3 : 1; 

            // Check existing to prevent duplicates
            if (Endorsement::where('thesis_id', $thesis->id)->count() >= $endorsementCount) continue;

            for ($i = 0; $i < $endorsementCount; $i++) {
                
                $creationDate = null;
                $adviserApproved = true;
                $coordinatorApproved = true;

                // --- 4TH YEAR TIMELINE LOGIC (MOR -> DP1 -> DP2) ---
                if ($yearLevel >= 4) {
                    if ($i == 0) {
                        // MOR: Past History (~1 year ago)
                        $creationDate = Carbon::now()->subMonths(10); 
                    } elseif ($i == 1) {
                        // DP1: Past History (~5 months ago - Last Sem)
                        $creationDate = Carbon::now()->subMonths(5);
                    } elseif ($i == 2) {
                        // DP2: CURRENT (~Recent weeks or Now)
                        $creationDate = Carbon::now()->subDays(rand(1, 14)); // Submitted recently
                        
                        // Current record approval might be pending (90% chance approved)
                        if (rand(1, 100) > 90) {
                            $adviserApproved = (bool)rand(0, 1);
                            $coordinatorApproved = $adviserApproved ? false : false;
                        }
                    }
                } 
                // --- 3RD YEAR TIMELINE LOGIC (MOR only) ---
                else {
                    // MOR: CURRENT (~Recent weeks or Now)
                    $creationDate = Carbon::now()->subDays(rand(1, 14));
                    
                    // Current record approval might be pending
                    if (rand(1, 100) > 90) {
                        $adviserApproved = (bool)rand(0, 1);
                        $coordinatorApproved = $adviserApproved ? false : false;
                    }
                }

                Endorsement::factory()->create([
                    'thesis_id'               => $thesis->id,
                    'is_adviser_approved'     => $adviserApproved,
                    'is_coordinator_approved' => $coordinatorApproved,
                    'created_at'              => $creationDate,
                    'updated_at'              => $creationDate,
                ]);
            }
        }
    }
}
