<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
                'tbl_faculties.name_prefix',
                'tbl_faculties.first_name',
                'tbl_faculties.last_name',
                'tbl_faculties.suffix',
                'tbl_faculties.is_regular',
                
                DB::raw("DATE_FORMAT(users.created_at, '%M %e, %Y') as date_added"),
                DB::raw("GROUP_CONCAT(DISTINCT tbl_faculty_roles.role_name SEPARATOR ', ') as roles")
            )
            ->groupBy(
                'tbl_faculties.id',
                'users.identity_no',
                'users.email',
                'users.created_at',
                'tbl_faculties.name_prefix',
                'tbl_faculties.first_name',
                'tbl_faculties.last_name',
                'tbl_faculties.suffix',
                'tbl_faculties.is_regular'
            )
            ->get();

        // dd($faculties);

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
        // Validate Input
        $validated = $request->validate([
            'faculty_id' => 'required|string|unique:users,identity_no',
            'email'      => 'required|email|unique:users,email',
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'name_prefix'=> 'nullable|string|max:50',
            'suffix'     => 'nullable|string|max:50',
            'type'       => 'required|in:Full-time,Part-time',
            'roles'      => 'nullable|array',
            'roles.*'    => 'string|exists:tbl_faculty_roles,role_name',
            'advisee_block' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) use ($request) {
                    if (in_array('Adviser', $request->roles ?? []) && empty($value)) {
                        $fail('The advisee block is required when the Adviser role is selected.');
                    }
                },
            ],
        ]);

        try {
            DB::transaction(function () use ($validated, $request) {

                // GET ACTIVE SCHOOL YEAR (Required for assignments)
                $activeSyId = DB::table('tbl_school_years')
                    ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
                    ->where('tbl_semesters.is_active', true)
                    ->value('tbl_school_years.id');

                if (!$activeSyId) {
                    throw new \Exception("No active school year found. Please activate a semester first.");
                }

                // Create User Account (Authentication)
                $userId = DB::table('users')->insertGetId([
                    'name'        => $validated['first_name'] . ' ' . $validated['last_name'],
                    'email'       => $validated['email'],
                    'identity_no' => $validated['faculty_id'],
                    'password'    => Hash::make($validated['faculty_id']), // Default password is faculty ID
                    'role'        => 'faculty',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                // Create Faculty Profile
                $facultyId = DB::table('tbl_faculties')->insertGetId([
                    'user_id'     => $userId,
                    'first_name'  => $validated['first_name'],
                    'last_name'   => $validated['last_name'],
                    'name_prefix' => $validated['name_prefix'] ?? "Prof.",
                    'suffix'      => $validated['suffix'],
                    'is_regular'  => $validated['type'] === 'Full-time' ? true : false,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                // Assigning Roles Logic
                $rolesToAssign = $request->roles ?? [];

                // Every faculty is automatically a 'Panelist'
                $rolesToAssign[] = 'Panelist';

                // If 'Adviser', also assign 'Committee'
                if (in_array('Adviser', $rolesToAssign)) {
                    $rolesToAssign[] = 'Committee'; 
                }

                // Remove duplicates
                $rolesToAssign = array_unique($rolesToAssign);


                if (!empty($rolesToAssign)) {
                    foreach ($rolesToAssign as $roleName) {

                    $roleId = DB::table('tbl_faculty_roles')
                                ->where('role_name', '=', $roleName)
                                ->value('id');

                        if (!$roleId) {
                            Log::error("Role not found: " . $roleName);
                            continue; 
                        }

                    if ($roleId) {
                        // Create Assignment
                        $assignmentId = DB::table('tbl_faculty_assignments')->insertGetId([
                            'faculty_id' => $facultyId,
                            'role_id'    => $roleId,
                            'sy_id'      => $activeSyId,
                            'is_active'  => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]); 

                        // Link Section Adviser (Only if ID was generated)
                        if ($assignmentId && $roleName === 'Adviser' && !empty($request->advisee_block)) {
                            $updated = DB::table('tbl_section_advisers')
                                ->where('section', $request->advisee_block)
                                ->whereNull('faculty_assign_id')          
                                ->take(1)                                   
                                ->update([
                                    'faculty_assign_id' => $assignmentId
                                ]);

                            if ($updated === 0) {
                                throw new \Exception("No available slot found for Section " . $request->advisee_block . ". Please ask Admin to generate section slots first.");
                            }
                        }
                    }
                }
            }
        });

            return redirect()->back()->with('success', 'Faculty member added successfully.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to add faculty: ' . $e->getMessage()]);
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
