<?php

namespace Database\Seeders;

use App\Models\Resource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get the Admin Name for the "__uploaded_by" log field
        $admin = User::where('email', 'admin@example.com')->first();
        $uploaderName = $admin ? $admin->name : 'System Admin';

        // 2. Create Mandatory Documents (Realistic Data)
        $essentialDocs = [
            [
                'file_name'    => 'Thesis Manuscript Format Guidelines 2025.pdf',
                // 'description'  => 'Standard formatting rules for Chapter 1-5, including font, spacing, and citation style (IEEE).',
                'file_type'    => 'PDF',
                'file_path'    => 'resources/guidelines_2025.pdf',
                'status'       => 1,
            ],
            [
                'file_name'    => 'Topic Proposal Form (Form 1A).docx',
                // 'description'  => 'Downloadable form for initial topic proposal approval.',
                'file_type'    => 'DOCX',
                'file_path'    => 'resources/form_1a_proposal.docx',
                'status'       => 1,
            ],
            [
                'file_name'    => 'Panel Evaluation Rubric.pdf',
                // 'description'  => 'Scoring sheet used by panelists during MOR and DP Defense.',
                'file_type'    => 'PDF',
                'file_path'    => 'resources/grading_rubric_v2.pdf',
                'status'       => 1,
            ],
            [
                'file_name'    => 'Certificate of Statisticians.docx',
                // 'description'  => 'Required attachment for quantitative research papers.',
                'file_type'    => 'DOCX',
                'file_path'    => 'resources/stat_cert_template.docx',
                'status'       => 1,
            ],
            [
                'file_name'    => 'Ethics Clearance Application.pdf',
                // 'description'  => 'Checklist and forms for University Ethics Board review.',
                'file_type'    => 'PDF',
                'file_path'    => 'resources/ethics_checklist.pdf',
                'status'       => 1,
            ],
        ];

        foreach ($essentialDocs as $doc) {
            Resource::firstOrCreate(
                ['file_name' => $doc['file_name']], // Ensure unique file_name
                [
                    // 'description'   => $doc['description'],
                    'file_path'     => $doc['file_path'],
                    'file_type'     => $doc['file_type'],
                    'file_size'     => rand(1, 5) . '.' . rand(10, 99), 
                    'uploaded_by'   => $uploaderName,
                    'uploaded_at'   => Carbon::now()->subDays(rand(0, 30)),
                    'is_active'     => $doc['status']
                ]
            );
        }

        // 3. Create random filler resources for testing pagination/search
        // Resource::factory(5)->create([
        //     // '__uploaded_by' => $uploaderName,
        // ]);

        $this->command->info("Seeded resources: " . count($essentialDocs) . " items.");
    }
}
