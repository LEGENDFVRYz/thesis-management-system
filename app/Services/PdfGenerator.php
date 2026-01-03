<?php

namespace App\Services;

use Illuminate\Support\Facades\View;
use Spatie\Browsershot\Browsershot;

class PdfGenerator
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function generate(string $view, array $data, string $filename = 'document.pdf', string $orientation = 'portrait')
    {
        $html = View::make($view, $data)->render();

        // Configure Browsershot
        $browsershot = Browsershot::html($html)
                            ->format('A4')
                            ->margins(10, 10, 10, 10)
                            ->showBackground() 
                            ->waitUntilNetworkIdle();

        // Orientation
        if ($orientation === 'landscape') {
            $browsershot->landscape();
        }

        // Idling
        $browsershot->timeout(30);

        // Generate PDF
        $pdfContent = $browsershot->pdf();

        // Stream the outpui
        return response()->streamDownload(
            fn () => print($pdfContent),
            $filename
        );
    }


    /**
     *  Save the PDF to a specific local path (for Jobs/Seeders purposes)
     */
    public function save(string $view, array $data, string $fullPath, string $orientation = 'portrait')
    {
        $html = View::make($view, $data)->render();

        $browsershot = Browsershot::html($html)
            ->format('A4')
            ->margins(10, 10, 10, 10)
            ->showBackground()
            ->waitUntilNetworkIdle();

        if ($orientation === 'landscape') {
            $browsershot->landscape();
        }

        // Create the directory if it doesn't exist
        $directory = dirname($fullPath);
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        // SAVE to the path
        $browsershot->save($fullPath);
        
        return $fullPath;
    }
}
