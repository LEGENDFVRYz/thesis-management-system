<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use App\Models\SchoolYear;
use App\Models\SectionAdviser;
use App\Models\Semester;
use App\Models\Student;
use App\Models\ThesisGroup;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $faker = Faker::create();

        // We need this ID to link assignments correctly.
        $activeSemester = Semester::where('is_active', true)->first();
        $syId = $activeSemester->school_year_id;

        $assignRoles = function ($facultyId, $primaryRoleName) use ($syId) {
            $rolesToAssign = ['Panelist']; // Everyone is a Panelist

            // If their primary role is Adviser, they MUST be a Committee member too
            if ($primaryRoleName === 'Adviser') {
                $rolesToAssign[] = 'Committee';
                $rolesToAssign[] = 'Adviser';
            } 
            // Add their specific role (e.g., Coordinator, Admin) if it's not Adviser (handled above)
            elseif ($primaryRoleName !== 'Panelist') {
                $rolesToAssign[] = $primaryRoleName;
            }

            foreach ($rolesToAssign as $rName) {
                $rId = FacultyRole::where('role_name', $rName)->value('id');
                if ($rId) {
                    FacultyAssignment::firstOrCreate([
                        'faculty_id' => $facultyId,
                        'role_id'    => $rId,
                        'sy_id'      => $syId,
                    ], ['is_active' => true]);
                }
            }
        };

        // Create Admin
        $adminUser = User::firstOrNew(['email' => 'admin@example.com']);
        $adminUser->fill([
            'name' => 'Admin User',
            'password' => Hash::make('test123'),
            'email_verified_at' => $now,
            'role' => 'faculty',
            'identity_no' => '2022-87000-JB-D'
        ])->save();

        $adminProfile = Faculty::firstOrCreate(['user_id' => $adminUser->id], [
            'name_prefix' => 'Dr.',
            'first_name' => 'Admin',
            'last_name' => 'User',
        ]);

        $assignRoles($adminProfile->id, 'Admin');

        // Create Faculty
        $facUser = User::firstOrNew(['email' => 'faculty@example.com']);
        $facUser->fill([
            'name' => 'Faculty User',
            'password' => Hash::make('test123'),
            'email_verified_at' => $now,
            'role' => 'faculty',
            'identity_no' => '2022-87001-JB-D',
            'remember_token' => null,
        ])->save();

        $facProfile = Faculty::firstOrCreate(['user_id' => $facUser->id], [
            'name_prefix' => $faker->randomElement(['Dr.', 'Prof.', 'Engr.']),
            'first_name' => 'Faculty',
            'last_name' => 'User'
        ]);

        $assignRoles($facProfile->id, 'Panelist'); // Default role

        // Create Specialized Accounts per Role
        $roles = ['Adviser', 'Co-adviser', 'Coordinator', 'Committee', 'Panelist', 'Awardee'];
        foreach ($roles as $roleName) {
            $email = strtolower($roleName) . '@example.com';
            
            $roleId = FacultyRole::where('role_name', $roleName)->value('id');

            if (!$roleId) continue; // Safety check

            $u = User::firstOrNew(['email' => $email]);
            $u->fill([
                'name' => "$roleName User", 
                'password' => Hash::make('test123'), 
                'role' => 'faculty',
                'email_verified_at' => $now,
                'identity_no' => "2025-000-{$roleId}-TEST",
                'remember_token' => null,
            ])->save();

            $p = Faculty::firstOrCreate(['user_id' => $u->id], [
                'name_prefix' => $faker->randomElement(['Dr.', 'Prof.', 'Engr.']),
                'first_name' => $roleName,
                'last_name' => 'User'
            ]);
            
            // Apply the logic (Adviser -> Committee, All -> Panelist)
            $assignRoles($p->id, $roleName);
        }

        // Create Student
        $student = User::firstOrNew(['email' => 'student@example.com']);
        $student->fill([
            'name' => 'Student User', 
            'password' => Hash::make('test123'), 
            'role' => 'student', 
            'identity_no' => 'STUD-001',
            'email_verified_at' => $now,
            'identity_no' => '2022-00001-MN-0',
            'remember_token' => null,
        ])->save();
        
        // // Check if profile exists; if not, create it
        // if (!Student::where('user_id', $student->id)->exists()) {
            
        //     // A. Find Section 1 Adviser (MUST EXIST from SectionAdviserSeeder)
        //     // We strictly search for an existing adviser. We DO NOT create one if missing.
        //     $adviser = SectionAdviser::where('section', 1)
        //         ->whereHas('assignment', fn($q) => $q->where('sy_id', $syId))
        //         ->first();

        //     if ($adviser) {
        //         // B. Create Group
        //         $group = ThesisGroup::firstOrCreate([
        //             'section_adviser_id' => $adviser->id,
        //             'group_number'       => 4 
        //         ]);

        //         // C. Create Student Record (Leader)
        //         // Removed explicit spec_id calculation logic for now
        //         $leader = Student::factory()->create([
        //             'user_id'    => $student->id,
        //             'first_name' => 'Student',
        //             'last_name'  => 'User',
        //             'group_id'   => $group->id,
        //             'section'    => $adviser->section,
        //             'is_leader'  => true,
        //         ]);

        //         // D. Create Members
        //         Student::factory()->count(3)->create([
        //             'group_id'  => $group->id,
        //             'section'   => $adviser->section,
        //             'spec_id'   => $leader->spec_id, // Inherit whatever the leader got
        //             'is_leader' => false,
        //         ]);

        //         $this->command->info("Student User created in Section {$adviser->section}.");
        //     } else {
        //         // If this triggers, it means SectionAdviserSeeder didn't run or didn't create Section 1
        //         $this->command->error("Section 1 Adviser NOT FOUND. Please ensure SectionAdviserSeeder runs before this.");
        //     }
        // }


        // Sample Admin account
        // $admin = User::firstOrNew(['email' => 'admin@example.com']);
        // $admin->name = 'Admin User';
        // $admin->email_verified_at = $now;
        // $admin->password = Hash::make('test123');
        // $admin->role = 'faculty'; // manual assignment since role is not fillable
        // $admin->identity_no = '2022-87000-JB-D';
        // $admin->remember_token = null;
        // $admin->save();

        // $adminn = Faculty::firstOrCreate(
        //     ['user_id' => $admin->id],
        //     [
        //         'name_prefix' => 'Dr.',
        //         'first_name' => 'Admin',
        //         'middle_name' => '',
        //         'last_name' => 'User',
        //         'is_regular' => true,
        //     ]
        // );

        // FacultyAssignment::firstOrCreate([
        //     'faculty_id' => $adminn->id,
        //     'role_id' => 1,
        //     'sy_id' => $activeSemester->school_year_id,
        // ], [
        //     'is_active' => true,
        // ]);

        // Sample Faculty account
        // $faculty = User::firstOrNew(['email' => 'faculty@example.com']);
        // $faculty->name = 'Faculty User';
        // $faculty->email_verified_at = $now;
        // $faculty->password = Hash::make('test123');
        // $faculty->role = 'faculty';
        // $faculty->identity_no = '2022-87001-JB-D';
        // $faculty->remember_token = null;
        // $faculty->save();

        // $facultyy = Faculty::firstOrCreate(
        //     ['user_id' => $faculty->id],
        //     [
        //         'name_prefix' => 'Prof.',
        //         'first_name' => 'Faculty',
        //         'middle_name' => '',
        //         'last_name' => 'User',
        //         'is_regular' => true,
        //     ]
        // );

        // FacultyAssignment::firstOrCreate([
        //     'faculty_id' => $facultyy->id,
        //     'role_id' => 2,
        //     'sy_id' => $activeSemester->school_year_id,
        // ], [
        //     'is_active' => true,
        // ]);


        // // Create Specialieed Account per each roles for testing
        // $roles = [
        //     2 => 'Adviser',
        //     3 => 'Co-adviser',
        //     4 => 'Coordinator',
        //     5 => 'Committee',
        //     6 => 'Panelist',
        //     7 => 'Awardee',
        // ];

        // foreach ($roles as $roleId => $roleName) {
        //     $email = strtolower($roleName) . '@example.com';
            
        //     // Create the User Account
        //     $user = User::firstOrNew(['email' => $email]);
        //     $user->name = $roleName . ' User';
        //     $user->email_verified_at = $now; // Ensure $now is defined (e.g. $now = now();)
        //     $user->password = Hash::make('test123');
        //     $user->role = 'faculty'; // Assuming they all need base access as faculty
        //     $user->identity_no = '2025-000' . $roleId . '-TEST'; // Unique ID generation
        //     $user->remember_token = null;
        //     $user->save();

        //     // Create the Faculty Profile
        //     $facultyProfile = Faculty::firstOrCreate(
        //         ['user_id' => $user->id],
        //         [
        //             'name_prefix' => 'Prof.',
        //             'first_name' => $roleName,
        //             'middle_name' => '',
        //             'last_name' => 'User',
        //             'is_regular' => true,
        //         ]
        //     );

        //     // Assign the specific Role
        //     FacultyAssignment::firstOrCreate([
        //         'faculty_id' => $facultyProfile->id,
        //         'role_id' => $roleId, 
        //         'sy_id' => $activeSemester->school_year_id,
        //     ], [
        //         'is_active' => true,
        //     ]);
        // }
        

        // // Sample Student account
        // $student = User::firstOrNew(['email' => 'student@example.com']);
        // $student->name = 'Student User';
        // $student->email_verified_at = $now;
        // $student->password = Hash::make('test123');
        // $student->role = 'student';
        // $student->identity_no = '2022-00001-MN-0';
        // $student->remember_token = null;
        // $student->save();

        // // 2. Ensure Profile Exists
        // if (!\App\Models\Student::where('user_id', $student->id)->exists()) {
    
        // // 1. FIND the existing Adviser for Section 1 (Active SY)
        // // We don't create it here anymore. We trust SectionAdviserSeeder made it.
        // $adviserForSec1 = \App\Models\SectionAdviser::where('section', 1)
        //     ->whereHas('assignment', function($q) use ($activeSemester) {
        //         $q->where('sy_id', $activeSemester->school_year_id);
        //     })->first();

        // // Safety fallback just in case seeds ran out of order
        // if (!$adviserForSec1) {
        //     $this->command->warn("Section 1 Adviser not found for Active SY. Please run SectionAdviserSeeder first.");
        //     return; 
        // }

        // // 2. Create Group & Leader
        // $safeGroup = \App\Models\ThesisGroup::firstOrCreate([
        //     'section_adviser_id' => $adviserForSec1->id,
        //     'group_number'       => 4 
        // ]);

        // $leader = \App\Models\Student::factory()->create([
        //     'user_id'    => $student->id,
        //     'first_name' => 'Student',
        //     'last_name'  => 'User',
        //     'group_id'   => $safeGroup->id, 
        //     'section'    => 1, 
        //     'is_leader'  => true,
        // ]);

        // \App\Models\Student::factory()->count(3)->create([
        //     'group_id'  => $leader->group_id, 
        //     'section'   => $leader->section, 
        //     'spec_id'   => $leader->spec_id, 
        //     'is_leader' => false,
        // ]);
        // }
    }
}
