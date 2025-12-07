<?php

namespace Database\Seeders;

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

        // Sample Admin account
        $admin = User::firstOrNew(['email' => 'admin@example.com']);
        $admin->name = 'Admin User';
        $admin->email_verified_at = $now;
        $admin->password = Hash::make('test123');
        $admin->role = 'admin'; // manual assignment since role is not fillable
        $admin->remember_token = null;
        $admin->save();

        // Sample Faculty account
        $faculty = User::firstOrNew(['email' => 'faculty@example.com']);
        $faculty->name = 'Faculty User';
        $faculty->email_verified_at = $now;
        $faculty->password = Hash::make('test123');
        $faculty->role = 'faculty';
        $faculty->remember_token = null;
        $faculty->save();

        // Sample Student account
        $student = User::firstOrNew(['email' => 'student@example.com']);
        $student->name = 'Student User';
        $student->email_verified_at = $now;
        $student->password = Hash::make('test123');
        $student->role = 'student';
        $student->remember_token = null;
        $student->save();
    }
}
