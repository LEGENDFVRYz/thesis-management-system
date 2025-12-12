<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\FileUploadRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/management/student');
    }

    public function store(FileUploadRequest $request): JsonResponse
    {
        // 1. Validate Mapping & Action
        $validator = Validator::make($request->all(), [
            'mapping' => 'required|json',
            'action'  => 'required|in:update,skip',
            'dry_run' => 'boolean' // Add this optional flag
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Retrieve Data
        $file    = $request->file('file');
        $mapping = json_decode($request->input('mapping'), true);
        $action  = $request->input('action');
        $isDryRun = $request->boolean('dry_run'); // Check if this is just a preview

        // 3. Open File
        $handle = fopen($file->getRealPath(), 'r');
        
        // Handle BOM for Excel-generated CSVs
        if (fread($handle, 3) !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $headers = fgetcsv($handle, 1000, ',');

        // 4. Map Columns
        $indexMap = [];
        foreach ($mapping as $dbField => $csvHeader) {
            $index = array_search($csvHeader, $headers);
            if ($index !== false) {
                $indexMap[$dbField] = $index;
            }
        }

        // 5. Processing Loop
        $stats = [
            'to_create' => 0,
            'to_update' => 0,
            'to_skip'   => 0,
            'errors'    => 0,
        ];

        // Start Transaction only if we are actually saving
        if (!$isDryRun) {
            DB::beginTransaction();
        }

        try {
            while (($row = fgetcsv($handle, 1000, ",")) !== false) {
                // Skip empty rows
                if (array_filter($row) == []) continue;

                // Extract ID safely
                $studentId = isset($indexMap['student_id']) ? ($row[$indexMap['student_id']] ?? null) : null;
                $name      = isset($indexMap['name']) ? ($row[$indexMap['name']] ?? null) : null;
                $email     = isset($indexMap['email']) ? ($row[$indexMap['email']] ?? null) : null;

                if (!$studentId) {
                    $stats['errors']++;
                    continue; 
                }

                // Check Existence
                $existingUser = User::where('identity_no', $studentId)->first();

                if ($existingUser) {
                    if ($action === 'update') {
                        $stats['to_update']++;
                        
                        if (!$isDryRun) {
                            $existingUser->update([
                                'name'  => $name,
                                'email' => $email,
                            ]);
                        }
                    } else {
                        $stats['to_skip']++;
                    }
                } else {
                    $stats['to_create']++;

                    if (!$isDryRun) {
                        User::create([
                            'name'        => $name,
                            'identity_no' => $studentId,
                            'email'       => $email,
                            'role'        => 'student',
                            'password'    => Hash::make('suffering'),
                        ]);
                    }
                }
            }

            if (!$isDryRun) {
                DB::commit();
                $message = "Import Successful! Created: {$stats['to_create']}, Updated: {$stats['to_update']}.";
            } else {
                $message = "Preview Complete.";
            }

            fclose($handle);

            return response()->json([
                'message' => $message,
                'dry_run' => $isDryRun,
                'stats'   => $stats
            ]);

        } catch (\Exception $e) {
            if (!$isDryRun) {
                DB::rollBack();
            }
            fclose($handle);
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}