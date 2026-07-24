<?php

use App\Models\Faculty;
use App\Models\Student;

test('profile page is displayed', function () {
    $student = Student::factory()->create();

    $response = $this
        ->actingAs($student->user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('student profile information can be updated', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'middle_name' => null,
            'suffix' => null,
            'email' => 'updated@example.com',
            'current_password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $student->refresh();
    $user->refresh();

    expect($student->first_name)->toBe('Updated');
    expect($student->last_name)->toBe('Name');
    expect($user->email)->toBe('updated@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('faculty profile information can be updated', function () {
    $faculty = Faculty::factory()->create();
    $user = $faculty->user;

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'middle_name' => null,
            'suffix' => null,
            'email' => 'updated-faculty@example.com',
            'current_password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $faculty->refresh();
    $user->refresh();

    expect($faculty->first_name)->toBe('Updated');
    expect($faculty->last_name)->toBe('Name');
    expect($user->email)->toBe('updated-faculty@example.com');
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'first_name' => $student->first_name,
            'last_name' => $student->last_name,
            'middle_name' => null,
            'suffix' => null,
            'email' => $user->email,
            'current_password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('profile update requires the correct current password', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'email' => $user->email,
            'current_password' => 'wrong-password',
        ]);

    $response->assertSessionHasErrors('current_password');
});

test('user can delete their account', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $student = Student::factory()->create();
    $user = $student->user;

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
