<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        $profileData = [];
        $facultyList = [];
        $isAdmin = false;

        if ($user->role === 'student') {
            $profileData = DB::table('tbl_students')
                ->where('user_id', $user->id)
                ->select(
                    'first_name',
                    'middle_name',
                    'last_name',
                    'suffix'
                )
                ->first();
        }

        if ($user->role === 'faculty') {
            $profileData = DB::table('tbl_faculties')
                ->where('user_id', $user->id)
                ->select(
                    'first_name',
                    'middle_name',
                    'last_name',
                    'suffix'
                )
                ->first();
        }

        $authUser = array_merge(
            $user->toArray(),
            (array) $profileData
        );

        // Transfer Admin Logic
        $facultyId = DB::table('tbl_faculties')
            ->where('user_id', Auth::id())
            ->value('id');

        if ($facultyId) {
            $currentUserRole = DB::table('tbl_faculty_assignments')
                ->where('faculty_id', $facultyId)
                ->where('role_id', 1)
                ->where('is_active', 1)
                ->first();

            $isAdmin = ! is_null($currentUserRole);

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
                        DB::raw("CONCAT(f.name_prefix, ' ', f.first_name, ' ', f.last_name) as name"),
                        'u.email'
                    )
                    ->distinct()
                    ->get()
                    ->map(fn ($f) => [
                        'id' => $f->id,
                        'name' => $f->name,
                        'email' => $f->email,
                    ])
                    ->toArray();
            }
        }

        return Inertia::render('settings/profile', [
            'user' => $authUser,
            'facultyList' => $facultyList,
            'isAdmin' => $isAdmin,
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // TASK 4.2: Maryel     --part 2/2
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Update logic

        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'suffix' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'current_password' => ['required', 'current_password'],
        ]);

        DB::transaction(function () use ($validated, $user) {

            if ($user->role === 'faculty') {
                DB::table('tbl_faculties')
                    ->where('user_id', $user->id)
                    ->update([
                        'first_name' => $validated['first_name'],
                        'middle_name' => $validated['middle_name'] ?? null,
                        'last_name' => $validated['last_name'],
                        'suffix' => $validated['suffix'] ?? null,
                        'updated_at' => now(),
                    ]);
            } else {
                DB::table('tbl_students')
                    ->where('user_id', $user->id)
                    ->update([
                        'first_name' => $validated['first_name'],
                        'middle_name' => $validated['middle_name'] ?? null,
                        'last_name' => $validated['last_name'],
                        'suffix' => $validated['suffix'] ?? null,
                        'updated_at' => now(),
                    ]);
            }

            // Build full name (NO prefix)
            $fullName = trim(collect([
                $validated['first_name'],
                $validated['middle_name'] ?? null,
                $validated['last_name'],
                $validated['suffix'] ?? null,
            ])->filter()->implode(' '));

            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'name' => $fullName,
                    'email' => $validated['email'],
                    'email_verified_at' => $validated['email'] !== $user->email ? null : $user->email_verified_at,
                    'updated_at' => now(),
                ]);
        });

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Transfer admin role to another faculty member
     */
    public function transferAdmin(Request $request)
    {
        $user = Auth::user();

        $facultyId = DB::table('tbl_faculties')
            ->where('user_id', $user->id)
            ->value('id');

        // Check if current user is admin (role_id = 1, is_active = 1)
        $currentUserRole = DB::table('tbl_faculty_assignments')
            ->where('faculty_id', $facultyId)
            ->where('role_id', 1)
            ->where('is_active', 1)
            ->first();

        if (! $currentUserRole) {
            return back()->withErrors(['error' => 'You are not authorized to transfer admin role.']);
        }

        // Validate request
        $validated = $request->validate([
            'faculty_id' => ['required', 'integer', 'exists:tbl_faculties,id'],
            'revoke_self' => ['nullable', 'boolean'],
        ]);

        // Get the active school year ID
        $activeSyId = DB::table('tbl_semesters')
            ->where('is_active', 1)
            ->value('school_year_id');

        if (! $activeSyId) {
            return back()->withErrors(['error' => 'No active school year found.']);
        }

        DB::transaction(function () use ($validated, $facultyId, $activeSyId) {
            // First, promote target faculty to admin (create or activate assignment)
            $existing = DB::table('tbl_faculty_assignments')
                ->where('faculty_id', $validated['faculty_id'])
                ->where('role_id', 1)
                ->first();

            if ($existing) {
                DB::table('tbl_faculty_assignments')
                    ->where('id', $existing->id)
                    ->update(['is_active' => 1, 'updated_at' => now()]);
            } else {
                DB::table('tbl_faculty_assignments')->insert([
                    'faculty_id' => $validated['faculty_id'],
                    'role_id' => 1,
                    'sy_id' => $activeSyId,
                    'is_active' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Then, revoke current user's admin if requested
            if ($validated['revoke_self'] ?? false) {
                DB::table('tbl_faculty_assignments')
                    ->where('faculty_id', $facultyId)
                    ->where('role_id', 1)
                    ->update(['is_active' => 0, 'updated_at' => now()]);
            }
        });

        return back()->with('success', 'Admin role transferred successfully.');
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
