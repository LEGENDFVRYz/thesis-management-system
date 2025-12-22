<?php

namespace Database\Seeders;

use App\Models\Resource;
use App\Models\User;
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
        // $admin = User::where('email', 'admin@example.com')->first();
        // // $uploaderName = $admin ? $admin->name : 'System Admin';

        // 2. Create Mandatory Documents (Realistic Data)
        $essentialDocs = [
            [
                'title'       => 'Thesis Manuscript Format Guidelines 2025',
                'description' => 'Standard formatting rules for Chapter 1-5, including font, spacing, and citation style (IEEE).',
                'file_type'   => 'pdf',
                'file_path'   => 'resources/guidelines_2025.pdf',
            ],
            [
                'title'       => 'Topic Proposal Form (Form 1A)',
                'description' => 'Downloadable form for initial topic proposal approval.',
                'file_type'   => 'docx',
                'file_path'   => 'resources/form_1a_proposal.docx',
            ],
            [
                'title'       => 'Panel Evaluation Rubric',
                'description' => 'Scoring sheet used by panelists during MOR and DP Defense.',
                'file_type'   => 'pdf',
                'file_path'   => 'resources/grading_rubric_v2.pdf',
            ],
            [
                'title'       => 'Certificate of Statisticians',
                'description' => 'Required attachment for quantitative research papers.',
                'file_type'   => 'docx',
                'file_path'   => 'resources/stat_cert_template.docx',
            ],
            [
                'title'       => 'Ethics Clearance Application',
                'description' => 'Checklist and forms for University Ethics Board review.',
                'file_type'   => 'pdf',
                'file_path'   => 'resources/ethics_checklist.pdf',
            ],
        ];

        foreach ($essentialDocs as $doc) {
            Resource::firstOrCreate(
                ['title' => $doc['title']], // Check unique title
                [
                    'description'   => $doc['description'],
                    'file_path'     => $doc['file_path'],
                    'file_type'     => $doc['file_type'],
                    'file_size'     => rand(1, 5) . '.' . rand(10, 99), // Random size 1.xx MB
                    // '__uploaded_by' => $uploaderName,
                    'is_active'     => true,
                ]
            );
        }

        // 3. Create random filler resources for testing pagination/search
        // Resource::factory(5)->create([
        //     // '__uploaded_by' => $uploaderName,
        // ]);

        $this->command->info("Seeded resources: " . (count($essentialDocs)) . " items.");
    }
}
