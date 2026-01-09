<?php

namespace App\Http\Controllers\Faculty\Adviser\AdviseeManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MyAdvisees extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = Auth::id(); // logged-in faculty user

        $search   = $request->input('search');
        $section  = $request->input('block');
        $leader   = $request->input('is_leader');

        $students = DB::table('tbl_students as s')

            // Student user account (ID + email)
            ->leftJoin('users as student_user', 's.user_id', '=', 'student_user.id')

            // Resolve adviser via section
            ->join('tbl_section_advisers as sa', 's.section', '=', 'sa.section')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')

            ->select([
                // Student identity
                'student_user.identity_no as student_id',
                'student_user.email as pup_webmail',

                // Student details
                's.last_name',
                's.first_name',
                's.group_id as group_code',
                's.section as block',
                's.is_leader',
            ])

            // Adviser restriction
            ->where('f.user_id', $userId)
            ->where('fa.role_id', 2); // ADVISER ONLY

        // 🔍 SEARCH
        if ($search) {
            $students->where(function ($q) use ($search) {
                $q->where('s.last_name', 'like', "%{$search}%")
                  ->orWhere('s.first_name', 'like', "%{$search}%")
                  ->orWhere('student_user.identity_no', 'like', "%{$search}%");
            });
        }

        // 🎯 FILTERS
        if ($section) {
            $students->where('s.section', $section);
        }

        if (!is_null($leader)) {
            $students->where('s.is_leader', $leader);
        }

        $students = $students
            ->orderBy('s.last_name')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render(
            'Faculty/management/adviser/advisee_management/my_advisees',
            [
                'students' => $students,
                'filters'  => $request->only(['search', 'block', 'is_leader']),
            ]
        );
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
    public function show(int $studentUserId)
    {
        $facultyUserId = auth()->id();

        $student = DB::table('tbl_students as s')
            ->leftJoin('users as student_user', 's.user_id', '=', 'student_user.id')
            ->join('tbl_section_advisers as sa', 's.section', '=', 'sa.section')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')

            ->select([
                'student_user.identity_no as student_id',
                'student_user.email as pup_webmail',
                's.last_name',
                's.first_name',
                's.group_id',
                's.section',
                's.is_leader',
            ])

            ->where('f.user_id', $facultyUserId)
            ->where('fa.role_id', 2)
            ->where('s.user_id', $studentUserId)
            ->first();

        abort_if(!$student, 404);

        return response()->json($student);
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