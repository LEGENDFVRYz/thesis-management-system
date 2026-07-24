<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
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
                DB::raw("GROUP_CONCAT(DISTINCT tbl_faculty_roles.role_name SEPARATOR ', ') as roles"), 

                DB::raw("(
                    SELECT sa.section 
                    FROM tbl_section_advisers sa
                    JOIN tbl_faculty_assignments fa ON sa.faculty_assign_id = fa.id
                    JOIN tbl_faculty_roles fr ON fa.role_id = fr.id
                    WHERE fa.faculty_id = tbl_faculties.id AND fr.role_name = 'Adviser'
                    LIMIT 1
                ) as advisee_block"),

                DB::raw("(
                    SELECT 
                        CASE 
                            WHEN sa.id BETWEEN 1 AND 7 THEN '3' 
                            WHEN sa.id BETWEEN 8 AND 14 THEN '4'
                            ELSE '?' 
                        END
                    FROM tbl_section_advisers sa
                    JOIN tbl_faculty_assignments fa ON sa.faculty_assign_id = fa.id
                    JOIN tbl_faculty_roles fr ON fa.role_id = fr.id
                    WHERE fa.faculty_id = tbl_faculties.id AND fr.role_name = 'Adviser'
                    LIMIT 1
                ) as advisee_year")
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

        $availableRows = DB::table('tbl_section_advisers')
        ->whereBetween('id', [1, 14])
        ->whereNull('faculty_assign_id') 
        ->select('id', 'section')
        ->orderBy('id', 'asc')
        ->get();

        // 2. Format for Frontend Dropdown
        $formattedSections = $availableRows->map(function ($row) {
            // Determine Year Level based on ID range
            // IDs 1-7 are 3rd Year, IDs 8-14 are 4th Year
            $year = ($row->id <= 7) ? 3 : 4;

            return [
                // VALUE: We combine Year and Section (e.g., "3-1" or "4-1") 
                // This ensures "Section 1" of 3rd year is different from "Section 1" of 4th year.
                'value' => "{$year}-{$row->section}", 
                
                // LABEL: What the user sees
                'label' => "BSCPE {$year}-{$row->section}"
            ];
        })->values()->toArray();

        return Inertia::render('Admin/management/faculty', [
            'faculties'=> $faculties,
            'availableSections' => $formattedSections
        ]);
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        
        $user = User::where('identity_no', $id)->firstOrFail();
        // 1. Validation
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'faculty_id' => 'required|string|max:50|unique:users,identity_no,' . $user->id, // Identity No
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'type' => 'required|string',
            'roles' => 'array',
            'advisee_block' => 'nullable|string'
        ]);

        $activeSyId = DB::table('tbl_semesters')->where('is_active', true)->value('school_year_id');

        if (!$activeSyId) {
            return back()->withErrors(['error' => 'Active school year not found.']);
        }

        // 2. Start Transaction
        DB::beginTransaction();

        try {
            // A. Find the User
            // Note: $id from route might be identity_no. Let's find user by it.
            $user = User::where('identity_no', $id)->firstOrFail();

            // B. Update User Table
            $user->update([
                'email' => $validated['email'],
                'identity_no' => $validated['faculty_id']   
            ]);

            // C. Update Faculty Profile Table
            $faculty = DB::table('tbl_faculties')->where('user_id', $user->id)->first();
            
            if ($faculty) {
                DB::table('tbl_faculties')->where('id', $faculty->id)->update([
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'suffix' => $request->suffix,
                    'name_prefix' => $request->name_prefix,
                    'is_regular' => ($validated['type'] === 'Full-Time' || $validated['type'] === 'Full-time') ? 1 : 0,
                    'updated_at' => now(),
                ]);
            }

            // D. Sync Roles (Delete old, Add new)
            // First, remove existing assignments for this faculty
            DB::table('tbl_faculty_assignments')->where('faculty_id', $faculty->id)->delete();

            // Add new roles
            foreach ($validated['roles'] as $roleName) {
                $roleId = DB::table('tbl_faculty_roles')->where('role_name', $roleName)->value('id');
                
                if ($roleId) {
                    $assignmentId = DB::table('tbl_faculty_assignments')->insertGetId([
                        'faculty_id' => $faculty->id,
                        'role_id' => $roleId,
                        'sy_id' => $activeSyId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // E. Handle "Adviser" Section Assignment
                    if ($roleName === 'Adviser' && !empty($validated['advisee_block'])) {
                        // $validated['advisee_block'] is "1", "2", etc.
                        
                        // Clear previous section assignment for this faculty (optional safeguard)
                        DB::table('tbl_section_advisers')
                            ->where('faculty_assign_id', $assignmentId) 
                            ->update(['faculty_assign_id' => null]);

                        // Assign to new section
                        // We need to find the section row. Assuming sections 1-7 (IDs 1-7) are 3rd year.
                        // You might need a more robust way to find the correct section ID based on the string "1".
                        
                        DB::table('tbl_section_advisers')
                        ->where('section', $validated['advisee_block'])
                        ->whereBetween('id', [1, 7]) 
                        ->update([
                            'faculty_assign_id' => $assignmentId
                        ]);
                    }
                }
            }

            DB::commit();
            return back()->with('success', 'Faculty updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update faculty: ' . $e->getMessage()]);
        }
    }
}
