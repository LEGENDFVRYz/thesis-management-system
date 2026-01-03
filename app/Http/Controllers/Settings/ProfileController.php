<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        // TASK 4.2: Maryel     --part 1/2
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Main Query: Get all the user (faculty/student) current information
        $user = Auth::user(); 

        $currentStudentInfo = null;
        $currentFacultyInfo = null;
        $facultyList = [];

        if ($user->role === 'student') {
            $currentStudentInfo = DB::table('users as u')
                ->join('tbl_students as s', 'u.id', '=', 's.user_id')
                ->where('s.user_id', $user->id)
                ->where('u.role', 'student')
                ->select(
                    'u.id as user_id',
                    'u.email',
                    'u.identity_no as student_no',
                    's.first_name',
                    's.last_name',
                    's.middle_name',
                    's.suffix',
                    //'f.profile_picture'
                )
                ->first();
            // dd(vars: $currentStudentInfo);
        }        
        
        if ($user->role === 'faculty') {
            $currentFacultyInfo = DB::table('users as u')
                ->join('tbl_faculties as f', 'u.id', '=', 'f.user_id')
                ->where('f.user_id', $user->id)
                ->where('u.role', 'faculty')
                ->select(
                    'u.id as user_id',
                    'u.email',
                    'u.identity_no as faculty_id',
                    'f.name_prefix',
                    'f.first_name',
                    'f.last_name',
                    'f.middle_name',
                    'f.suffix',
                    //'f.profile_picture'
                )
                ->first();
            // dd(vars: $currentFacultyInfo);

            $facultyId = DB::table('tbl_faculties')
                ->where('user_id', Auth::id())
                ->value('id');

            if ($facultyId) {
                $currentUserRole = DB::table('tbl_faculty_assignments')
                    ->where('faculty_id', $facultyId)
                    ->where('role_id', 1)
                    ->where('is_active', 1)
                    ->first();

                $isAdmin = !is_null($currentUserRole);

                if ($isAdmin) {    
                    $facultyList = DB::table('users as u')
                        ->join('tbl_faculties as f', 'u.id', '=', 'f.user_id')
                        ->join('tbl_faculty_assignments as fa', 'f.id', '=', 'fa.faculty_id')
                        ->join('tbl_faculty_roles as fr', 'fa.role_id', '=', 'fr.id')
                        ->leftJoin('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
                        ->leftJoin('tbl_semesters as sem', 'sy.id', '=', 'sem.school_year_id')
                        ->where('fr.id', '!=', 1)
                        ->where('u.id', '!=', $user->id)
                        ->where('u.role', 'faculty')
                        ->where('fa.is_active', 1)
                        ->where('sem.is_active', 1)
                        ->select(
                            'u.id',
                            DB::raw("CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) as faculty_name")
                        )
                        ->distinct()
                        ->get();
                }
            }
            // dd(vars: $facultyList);
        }

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'auth_user' => $user,
            'current_student_info' => $currentStudentInfo,
            'current_faculty_info' => $currentFacultyInfo,
            'faculty_list' => $facultyList,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function updateInfo(Request $request, string $id)
    {
        // TASK 4.2: Maryel     --part 2/2
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Update logic
        $user = Auth::user();

        if ($user->role === 'faculty') {
            $validated = $request->validate([
                'name_prefix' => ['nullable', 'string', 'max:20'],
                'first_name'  => ['required', 'string', 'max:100'],
                'last_name'   => ['required', 'string', 'max:100'],
                'middle_name' => ['nullable', 'string', 'max:100'],
                'suffix'      => ['nullable', 'string', 'max:20'],
                'email'       => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            ]);
        } elseif ($user->role === 'student') {
            $validated = $request->validate([
                'first_name'  => ['required', 'string', 'max:100'],
                'last_name'   => ['required', 'string', 'max:100'],
                'middle_name' => ['nullable', 'string', 'max:100'],
                'suffix'      => ['nullable', 'string', 'max:20'],
                'email'       => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            ]);
        } else {
            return back()->withErrors(['error' => 'Invalid user role.']);
        }

        try {
            DB::beginTransaction();

            if ($user->role === 'faculty') {
                $updateData = [
                    'first_name'  => $validated['first_name'],
                    'last_name'   => $validated['last_name'],
                    'middle_name' => $validated['middle_name'] ?? null,
                    'suffix'      => $validated['suffix'] ?? null,
                    'updated_at'  => now(),
                ];
    
                if (isset($validated['name_prefix'])) {
                    $updateData['name_prefix'] = $validated['name_prefix'];
                }
    
                DB::table('tbl_faculties')
                    ->where('user_id', $user->id)
                    ->update($updateData);
                
                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'name' => DB::raw("(SELECT CONCAT_WS(' ', 
                            NULLIF(name_prefix, ''), 
                            first_name, 
                            NULLIF(middle_name, ''), 
                            last_name, 
                            NULLIF(suffix, '')
                        ) FROM tbl_faculties WHERE user_id = {$user->id})"),
                        'email' => $validated['email'],
                        'email_verified_at' => $validated['email'] !== $user->email ? null : DB::raw('email_verified_at'),
                        'updated_at' => now(),
                    ]);
    
            } elseif ($user->role === 'student') {
                DB::table('tbl_students')
                    ->where('user_id', $user->id)
                    ->update([
                        'first_name'  => $validated['first_name'],
                        'last_name'   => $validated['last_name'],
                        'middle_name' => $validated['middle_name'] ?? null,
                        'suffix'      => $validated['suffix'] ?? null,
                        'updated_at'  => now(),
                    ]);

                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'name' => DB::raw("(SELECT CONCAT_WS(' ', 
                            first_name, 
                            NULLIF(middle_name, ''), 
                            last_name, 
                            NULLIF(suffix, '')
                        ) FROM tbl_students WHERE user_id = {$user->id})"),
                        'email' => $validated['email'],
                        'email_verified_at' => $validated['email'] !== $user->email ? null : DB::raw('email_verified_at'),
                        'updated_at' => now(),
                    ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Profile updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Profile update failed: ' . $e->getMessage());
            
            return back()->withErrors(['error' => 'Unable to update profile. Please try again.']);
        }

    }




    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }


}
