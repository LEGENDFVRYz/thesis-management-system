<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileUploadRequest;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FileImportController extends Controller
{
    protected FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Store and process the uploaded file.
     */
    public function store(FileUploadRequest $request): JsonResponse
    {
        // Validate the file
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv,txt|max:2048', // adjust types and size
        ]);

        $file = $request->file('file');

        if (!$file) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        // Store the file temporarily
        $path = $file->store('uploads'); // storage/app/uploads

        return response()->json([
            'message' => 'Upload Successful',
            'file_name' => $file->getClientOriginalName(),
            'path' => $path,
        ]);
    }
}
