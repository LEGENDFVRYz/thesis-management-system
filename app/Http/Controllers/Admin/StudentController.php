<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            
            // 6. Join Faculties (For Adviser Name)
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
                        WHEN tbl_faculty_assignments.school_year = '2025' THEN 
                            CONCAT('3', tbl_section_advisers.section, LPAD(tbl_thesis_groups.group_number, 2, '0'))
                        ELSE 
                            CONCAT(tbl_section_advisers.section, LPAD(tbl_thesis_groups.group_number, 2, '0')) 
                    END as group_code
                ")
            )
            ->orderBy('tbl_students.id', 'asc')
            ->get(); // Use ->paginate(10) if you want pagination

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
    public function store(Request $request)
    {
        //
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
