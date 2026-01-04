<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PdfViewerController extends Controller
{
    public function streamPdf($id)
    {
        // Testing path (for rendering purposes)
        $filePath = 'testing/long.pdf';
        

        // Security Check: 
        if (!Storage::disk('local')->exists($filePath)) {
            return response()->json([
                'error' => 'File Not Found',
                'path_checked' => storage_path('app/' . $filePath)
            ], 404);
        }

        // Retrieve content
        $fileContents = Storage::disk('local')->get($filePath);

        // Return as raw stream with PDF headers
        return response($fileContents, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="secure-view.pdf"');

    }
}

