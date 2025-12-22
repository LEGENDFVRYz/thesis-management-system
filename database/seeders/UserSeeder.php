<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\FacultyAssignment;
use App\Models\SchoolYear;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        // We need this ID to link assignments correctly.
        $activeSemester = Semester::where('is_active', true)->first();

        if (!$activeSemester) {
            $this->command->error("No active Semester found. Please run SchoolYearSeeder first.");
            return;
        }

        // Sample Admin account
        $admin = User::firstOrNew(['email' => 'admin@example.com']);
        $admin->name = 'Admin User';
        $admin->email_verified_at = $now;
        $admin->password = Hash::make('test123');
        $admin->role = 'faculty'; // manual assignment since role is not fillable
        $admin->identity_no = '2022-87000-JB-D';
        $admin->remember_token = null;
        $admin->save();

        $adminn = Faculty::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'name_prefix' => 'Dr.',
                'first_name' => 'Admin',
                'middle_name' => '',
                'last_name' => 'User',
                'is_regular' => true,
            ]
        );

        FacultyAssignment::firstOrCreate([
            'faculty_id' => $adminn->id,
            'role_id' => 1,
            'sy_id' => $activeSemester->school_year_id,
        ], [
            'is_active' => true,
        ]);

        // Sample Faculty account
        $faculty = User::firstOrNew(['email' => 'faculty@example.com']);
        $faculty->name = 'Faculty User';
        $faculty->email_verified_at = $now;
        $faculty->password = Hash::make('test123');
        $faculty->role = 'faculty';
        $faculty->identity_no = '2022-87001-JB-D';
        $faculty->remember_token = null;
        $faculty->save();

        $facultyy = Faculty::firstOrCreate(
            ['user_id' => $faculty->id],
            [
                'name_prefix' => 'Prof.',
                'first_name' => 'Faculty',
                'middle_name' => '',
                'last_name' => 'User',
                'is_regular' => true,
            ]
        );

        FacultyAssignment::firstOrCreate([
            'faculty_id' => $facultyy->id,
            'role_id' => 2,
            'sy_id' => $activeSemester->school_year_id,
        ], [
            'is_active' => true,
        ]);


        // Create Specialieed Account per each roles for testing
        $roles = [
            2 => 'Adviser',
            3 => 'Co-adviser',
            4 => 'Coordinator',
            5 => 'Committee',
            6 => 'Panelist',
            7 => 'Awardee',
        ];

        foreach ($roles as $roleId => $roleName) {
            $email = strtolower($roleName) . '@example.com';
            
            // Create the User Account
            $user = User::firstOrNew(['email' => $email]);
            $user->name = $roleName . ' User';
            $user->email_verified_at = $now; // Ensure $now is defined (e.g. $now = now();)
            $user->password = Hash::make('test123');
            $user->role = 'faculty'; // Assuming they all need base access as faculty
            $user->identity_no = '2025-000' . $roleId . '-TEST'; // Unique ID generation
            $user->remember_token = null;
            $user->save();

            // Create the Faculty Profile
            $facultyProfile = Faculty::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'name_prefix' => 'Prof.',
                    'first_name' => $roleName,
                    'middle_name' => '',
                    'last_name' => 'User',
                    'is_regular' => true,
                ]
            );

            // Assign the specific Role
            FacultyAssignment::firstOrCreate([
                'faculty_id' => $facultyProfile->id,
                'role_id' => $roleId, 
                'sy_id' => $activeSemester->school_year_id,
            ], [
                'is_active' => true,
            ]);
        }
        

        // Sample Student account
        $student = User::firstOrNew(['email' => 'student@example.com']);
        $student->name = 'Student User';
        $student->email_verified_at = $now;
        $student->password = Hash::make('test123');
        $student->role = 'student';
        $student->identity_no = '2022-00001-MN-0';
        $student->remember_token = null;
        $student->save();
    }
}
