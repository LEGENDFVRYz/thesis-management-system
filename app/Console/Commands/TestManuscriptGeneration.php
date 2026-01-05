<?php

namespace App\Console\Commands;

use App\Jobs\GenerateDummyManuscriptJob;
use Illuminate\Console\Command;

class TestManuscriptGeneration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'manuscript:test {count=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates a dummy manuscript PDF for testing layout';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = $this->argument('count');
        $path = 'testing';


        $this->info("Dispatching {$count} manuscript jobs to: {$path} folder");
        $bar = $this->output->createProgressBar($count);
        $bar->start();

        // Dispatch the Job Synchronously 
        for ($i = 1; $i <= $count; $i++) {
            $filename = "sample-manus_{$i}.pdf";

            GenerateDummyManuscriptJob::dispatchSync(
                $path, $filename,
                "TEST MANUSCRIPT {$i}: Creating Sample for seeder"
            );

            $bar->advance();
        }
    }
}
