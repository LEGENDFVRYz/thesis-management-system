<?php

namespace App\Jobs;

use App\Services\PdfGenerator;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Faker\Factory as Faker;


class GenerateDummyReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $path;
    protected $filename;

    /**
     * Create a new job instance.
     */
    public function __construct(string $path, string $filename)
    {
        $this->path = $path;
        $this->filename = $filename;
    }

    /**
     * Execute the job.
     */
    public function handle(PdfGenerator $pdfGenerator)
    {
        // Create dummy data for report
        $faker = Faker::create();
        $dummyData = [];

        for ($i = 0; $i < 20; $i++) {
            $dummyData[] = (object) [
                'id' => $i + 1,
                'name' => $faker->name,
                'status' => $faker->randomElement(['active', 'inactive', 'pending']),
                'created_at' => now()->subDays(rand(1, 30)),
            ];
        }

        // Path
        $cleanPath = rtrim($this->path, '/');
        $fullPath = "{$cleanPath}/{$this->filename}";

        // Generate pdf using the service
        $pdfGenerator->save(
            'pdf.layouts.dummy-report',    // Reusing your blade template
            [
                'items' => $dummyData, 
                'title' => 'Seeded Dummy Report - ' . now()->format('H:i:s')
            ],
            $fullPath,
            'landscape'
        );
    }
}
