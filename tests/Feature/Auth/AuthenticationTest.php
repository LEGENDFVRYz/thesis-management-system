<?php

use App\Models\Student;
use Illuminate\Support\Facades\RateLimiter;

test('student login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertStatus(200);
});

test('faculty login screen can be rendered', function () {
    $response = $this->get(route('faculty.login'));

    $response->assertStatus(200);
});

test('students can authenticate using the student login screen', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    $response = $this->post(route('student.store'), [
        'identity_no' => $user->identity_no,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('faculty can authenticate using the faculty login screen', function () {
    $faculty = \App\Models\Faculty::factory()->create();
    $user = $faculty->user;

    $response = $this->post(route('faculty.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('faculty.dashboard', absolute: false));
});

test('students cannot authenticate through the faculty login screen', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    $response = $this->post(route('faculty.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('faculty cannot authenticate through the student login screen', function () {
    $faculty = \App\Models\Faculty::factory()->create();
    $user = $faculty->user;

    $response = $this->post(route('student.store'), [
        'identity_no' => $user->identity_no,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('identity_no');
});

test('students cannot authenticate with invalid password', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    $this->post(route('student.store'), [
        'identity_no' => $user->identity_no,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('students can logout', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($student->user)->post(route('student.logout'));

    $this->assertGuest();
    $response->assertRedirect(route('login'));
});

test('faculty can logout', function () {
    $faculty = \App\Models\Faculty::factory()->create();

    $response = $this->actingAs($faculty->user)->post(route('faculty.logout'));

    $this->assertGuest();
    $response->assertRedirect('/faculty/login');
});

test('students are rate limited after too many failed attempts', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    RateLimiter::increment(md5(strtolower($user->identity_no).'|'.'127.0.0.1'), amount: 5);

    $response = $this->post(route('student.store'), [
        'identity_no' => $user->identity_no,
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('identity_no');
});
