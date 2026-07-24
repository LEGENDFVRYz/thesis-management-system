<?php

use App\Models\Faculty;
use App\Models\Student;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated students can visit the student dashboard', function () {
    $student = Student::factory()->create();

    $this->actingAs($student->user)
        ->get(route('dashboard'))
        ->assertOk();
});

test('authenticated faculty can visit the faculty dashboard', function () {
    $faculty = Faculty::factory()->create();

    $this->actingAs($faculty->user)
        ->get(route('faculty.dashboard'))
        ->assertOk();
});

test('students cannot visit the faculty dashboard', function () {
    $student = Student::factory()->create();

    $this->actingAs($student->user)
        ->get(route('faculty.dashboard'))
        ->assertForbidden();
});

test('faculty cannot visit the student dashboard', function () {
    $faculty = Faculty::factory()->create();

    $this->actingAs($faculty->user)
        ->get(route('dashboard'))
        ->assertForbidden();
});
