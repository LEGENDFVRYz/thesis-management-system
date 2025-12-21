<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\FileUploadRequest;
use App\Models\Faculty;
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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = DB::table('tbl_students')
            // 1. Join Users (For Student Number & Email)
            ->leftJoin('users', 'tbl_students.user_id', '=', 'users.id')
            
            // 2. Join Specializations (For Spec Name)
            ->leftJoin('tbl_specializations', 'tbl_students.spec_id', '=', 'tbl_specializations.id')
            
            // 3. Join Thesis Groups (For Group Number)
            ->leftJoin('tbl_thesis_groups', 'tbl_students.group_id', '=', 'tbl_thesis_groups.id')
            
            // 4. Join Adviser Assignments (For Section)
            // Note: We use the correct table name 'tbl_section_advisers'
            ->leftJoin('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            
            // 5. Join Faculty Assignments (For School Year)
            ->leftJoin('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')

            // 6. Join School Years (To get the actual Year string e.g., 2025)
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')

            // 7. Join Faculties (For Adviser Name)
            ->leftJoin('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            
            ->select(
                // --- Simple Columns ---
                'users.identity_no as student_number',
                'users.email',
                'tbl_students.section as block',
                'tbl_specializations.spec_name as specialization',

                // --- Concatenated Student Name ---
                DB::raw("CONCAT(tbl_students.first_name, ' ', tbl_students.last_name) as student_name"),

                // --- Concatenated Adviser Name ---
                DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as thesis_adviser"),

                // --- Complex Group Code Logic ---
                // Logic: IF year=2025 THEN Prefix '3' + Section + Padded Group Number (09)
                // ELSE: Section + Padded Group Number (09)
                DB::raw("
                    CASE 
                        WHEN tbl_school_years.year = 2025 THEN 
                            CONCAT('3', tbl_section_advisers.section, LPAD(tbl_thesis_groups.group_number, 2, '0'))
                        ELSE 
                            CONCAT('4', tbl_section_advisers.section, LPAD(tbl_thesis_groups.group_number, 2, '0')) 
                    END as group_code
                ")
            )
            ->orderBy('tbl_students.id', 'asc')
            ->get(); // Use ->paginate(10) if you want pagination
        
        // dd($students);

        return Inertia::render('Admin/management/student', [
            'students' => $students
        ]);
    }

    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
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

                if ($name) {
                    $parts = explode(' ', $name);

                    if (count($parts) >= 2) {
                        $firstName = $parts[0];
                        $lastName  = $parts[1];
                    }
                }

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
                        $temp = User::create([
                            'name'        => $name,
                            'identity_no' => $studentId,
                            'email'       => $email,
                            'role'        => 'student',
                            'password'    => Hash::make('suffering'),
                        ]);

                        Student::firstOrCreate(
                            ['user_id' => $temp->id],
                            [
                                'first_name' => $firstName ?? $name,
                                'last_name'  => $lastName ?? '<lastname>',
                                'section'    => 1,          # force buy muna para sa presentation
                                'spec_id'    => 2,          # force buy muna para sa presentation
                            ]
                        );
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


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}