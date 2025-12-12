<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\FileUploadRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use \Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        
        return Inertia::render('Admin/management/student');
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
        $validator = Validator::make($request->all(), [
            'mapping' => 'required|json',
            'action'  => 'required|in:update,skip',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        // Retrieve Data
        $file = $request->file('file');
        $mapping = json_decode($request->input('mapping'), true);
        $action = $request->input('action');

        // process the file
        $handle = fopen($file->getRealPath(), 'r');
        $headers = fgetcsv($handle, 1000, ',');


        $indexMap = [];
        foreach ($mapping as $field => $headerName) {
            $indexMap[$field] = array_search($headerName, $headers);
        }

        
        // Process each CSV row
        while (($row = fgetcsv($handle, 250, ",")) !== false) {

            $user = User::create([
                'name'        => $row[$indexMap['name']] ?? null,
                'identity_no' => $row[$indexMap['student_id']] ?? null,
                'email'       => $row[$indexMap['email']] ?? null,
                // 'block'       => $row[$indexMap['block']] ?? null,
                'role'        => 'student',
                'password'    => Hash::make('suffering'),
            ]);
        }

        // Results
        return response()->json([
            'message' => "Imssport successful! Created:"
        ]);
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
