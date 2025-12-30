<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faculties = DB::table('tbl_faculties')
            ->join('users', 'tbl_faculties.user_id', '=', 'users.id')
            ->leftJoin('tbl_faculty_assignments', 'tbl_faculties.id', '=', 'tbl_faculty_assignments.faculty_id')
            ->leftJoin('tbl_faculty_roles', 'tbl_faculty_assignments.role_id', '=', 'tbl_faculty_roles.id')
            ->select(
                'users.identity_no as faculty_id',
                'users.email',
                DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as faculty_name"),
                DB::raw("
                    CASE 
                        WHEN tbl_faculties.is_regular = 1 THEN 'Full-time'
                        ELSE 'Part-time' 
                    END as faculty_type
                "),
                
                // UPDATED DATE FORMAT HERE:
                DB::raw("DATE_FORMAT(users.created_at, '%M %e, %Y') as date_added"),
                
                DB::raw("GROUP_CONCAT(DISTINCT tbl_faculty_roles.role_name SEPARATOR ', ') as roles")
            )
            ->groupBy('tbl_faculties.id', 'users.identity_no', 'users.email', 'users.created_at', 'tbl_faculties.name_prefix', 'tbl_faculties.first_name', 'tbl_faculties.last_name', 'tbl_faculties.is_regular')
            ->get();

        return Inertia::render('Admin/management/faculty', [
            'faculties'=> $faculties
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
