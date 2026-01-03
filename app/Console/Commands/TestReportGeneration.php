<?php

namespace App\Console\Commands;

use App\Jobs\GenerateDummyReportJob;
use Illuminate\Console\Command;

class TestReportGeneration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:test {count=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch dummy report generation jobs for testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = $this->argument('count');
        $path = storage_path('app/private/testing');

        // Ensure directory exists
        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }

        $this->info("Dispatching {$count} report jobs to: {$path}");
        $bar = $this->output->createProgressBar($count);
        $bar->start();

        for ($i = 1; $i <= $count; $i++) {
            $filename = "sample-report_{$i}.pdf";
            
            GenerateDummyReportJob::dispatchSync($path, $filename);
            
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info('Done! Check your storage folder.');
    }
}
