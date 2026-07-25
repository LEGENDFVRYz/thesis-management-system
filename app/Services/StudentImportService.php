<?php

namespace App\Services;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * CSV batch-import pipeline behind the Admin "Students" pages upload
 * dialog. Moved out of StudentController::store() logic — including its
 * pre-existing bugs temporarily, which are intentionally not fixed here
 */
class StudentImportService
{
    /**
     * @param  array<string, string>  $mapping  dbField => csvHeader
     * @return array{message: string, dry_run: bool, stats: array}
     */
    public function importFromCsv(UploadedFile $file, array $mapping, string $action, bool $isDryRun): array
    {
        $handle = fopen($file->getRealPath(), 'r');

        // Handle BOM for Excel-generated CSVs
        if (fread($handle, 3) !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $headers = fgetcsv($handle, 1000, ',');

        $indexMap = [];
        foreach ($mapping as $dbField => $csvHeader) {
            $index = array_search($csvHeader, $headers);
            if ($index !== false) {
                $indexMap[$dbField] = $index;
            }
        }

        $stats = [
            'to_create' => 0,
            'to_update' => 0,
            'to_skip' => 0,
            'errors' => 0,
        ];

        // Start Transaction only if we are actually saving
        if (! $isDryRun) {
            DB::beginTransaction();
        }

        try {
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                // Skip empty rows
                if (array_filter($row) == []) {
                    continue;
                }

                // Extract ID safely
                $studentId = isset($indexMap['student_id']) ? ($row[$indexMap['student_id']] ?? null) : null;
                $name = isset($indexMap['name']) ? ($row[$indexMap['name']] ?? null) : null;
                $email = isset($indexMap['email']) ? ($row[$indexMap['email']] ?? null) : null;

                if ($name) {
                    $parts = explode(' ', $name);

                    if (count($parts) >= 2) {
                        $firstName = $parts[0];
                        $lastName = $parts[1];
                    }
                }

                if (! $studentId) {
                    $stats['errors']++;

                    continue;
                }

                // Check Existence
                $existingUser = User::where('identity_no', $studentId)->first();

                if ($existingUser) {
                    if ($action === 'update') {
                        $stats['to_update']++;

                        if (! $isDryRun) {
                            $existingUser->update([
                                'name' => $name,
                                'email' => $email,
                            ]);
                        }
                    } else {
                        $stats['to_skip']++;
                    }
                } else {
                    $stats['to_create']++;

                    if (! $isDryRun) {
                        $temp = User::create([
                            'name' => $name,
                            'identity_no' => $studentId,
                            'email' => $email,
                            'role' => 'student',
                            'password' => Hash::make('password123'),
                        ]);

                        Student::firstOrCreate(
                            ['user_id' => $temp->id],
                            [
                                'first_name' => $firstName ?? $name,
                                'last_name' => $lastName ?? '<lastname>',
                                'section' => 1,          // force buy muna para sa presentation
                                'spec_id' => 2,          // force buy muna para sa presentation
                            ]
                        );
                    }
                }
            }

            if (! $isDryRun) {
                DB::commit();
                $message = "Import Successful! Created: {$stats['to_create']}, Updated: {$stats['to_update']}.";
            } else {
                $message = 'Preview Complete.';
            }

            fclose($handle);

            return [
                'message' => $message,
                'dry_run' => $isDryRun,
                'stats' => $stats,
            ];
        } catch (\Exception $e) {
            if (! $isDryRun) {
                DB::rollBack();
            }
            fclose($handle);

            throw $e;
        }
    }
}
