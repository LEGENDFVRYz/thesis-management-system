<?php

namespace App\Jobs;

use App\Services\PdfGenerator;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Faker\Factory as Faker;

class GenerateDummyManuscriptJob implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    protected $path;
    protected $filename;
    protected $title;

    /**
     * Create a new job instance.
     */
    public function __construct(string $path, string $filename, string $title)
    {
        $this->path = $path;
        $this->filename = $filename;
        $this->title = $title;
    }

    /**
     * Execute the job.
     */
    public function handle(PdfGenerator $pdfGenerator): void
    {
        $faker = Faker::create();
        $chapters = [];

        // Generate 5 Chapters
        for ($i = 1; $i <= 5; $i++) {
            $parts = [];
            
            // Generate 3 "Parts" per Chapter
            for ($p = 1; $p <= 3; $p++) {
                $parts[] = [
                    'title' => $faker->sentence(4), // e.g., "Analysis of Data Points"
                    'content' => $faker->paragraphs(3, true) // 3 random paragraphs
                ];
            }

            $chapters[] = [
                'number' => $i,
                'title'  => $this->getChapterTitle($i), // Helper for realistic names
                'parts'  => $parts
            ];
        }

        // Prepare Path
        $cleanPath = rtrim($this->path, '/');
        $fullFilePath = "{$cleanPath}/{$this->filename}";

        $pdfGenerator->save(
            'pdf.layouts.dummy-manus', // The view we created above
            [
                'title' => $this->title,
                'chapters' => $chapters
            ],
            $fullFilePath,
            'portrait'
        );
    }

    /* Helper to for good chapters names */
    private function getChapterTitle($number)
    {
        $titles = [
            1 => 'The Problem and Its Background',
            2 => 'Review of Related Literature',
            3 => 'Methodology of the Study',
            4 => 'Presentation, Analysis, and Interpretation of Data',
            5 => 'Conclusions and Recommendations',
        ];

        return $titles[$number] ?? 'Supplementary Chapter';
    }
}
