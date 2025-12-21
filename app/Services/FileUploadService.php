<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class FileUploadService
{
    /**
     * Handle the upload of the file to temporary storage.
     *
     * @param UploadedFile $file
     * @return array
     */
    public function upload(UploadedFile $file): array
    {
        try {
            
            // Save to the file
            $disk = config('filesystems.default');
            $path = $file->store('temp', $disk);


            if (!$path) {
                throw new \RuntimeException("File storage failed on disk: {$disk}");
            }

            return [
                'name'      => $file->getClientOriginalName(),
                'path'      => $path,
                'size_kb'   => round($file->getSize() / 1024),
                'mime_type' => $file->getMimeType(),
            ];

        } catch (\Exception $e) {
            Log::error('File upload failed: ' . $e->getMessage());

            throw ValidationException::withMessages([
                'file' => 'Could not process the file. Please try again.',
            ]);
        }
    }
}