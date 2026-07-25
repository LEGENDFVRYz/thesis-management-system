<?php

use App\Models\Student;
use App\Models\User;
use App\Services\StudentImportService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->service = new StudentImportService;
});

function csvUploadFixture(string $content): UploadedFile
{
    return UploadedFile::fake()->createWithContent('students.csv', $content);
}

test('creates a new student from a CSV row', function () {
    $csv = "Student ID,Full Name,Email\n2023-00010,Alice Wonderland,alice@example.com\n";

    $result = $this->service->importFromCsv(
        file: csvUploadFixture($csv),
        mapping: ['student_id' => 'Student ID', 'name' => 'Full Name', 'email' => 'Email'],
        action: 'skip',
        isDryRun: false,
    );

    expect($result['stats']['to_create'])->toBe(1);
    expect($result['dry_run'])->toBeFalse();

    $user = User::where('identity_no', '2023-00010')->first();
    expect($user)->not->toBeNull();
    expect($user->role)->toBe('student');
    // Pinning known bug: hardcoded password, not a generated one.
    expect(Hash::check('suffering', $user->password))->toBeTrue();

    $student = Student::where('user_id', $user->id)->first();
    expect($student)->not->toBeNull();
    expect($student->first_name)->toBe('Alice');
    expect($student->last_name)->toBe('Wonderland');
    // Pinning known bug: section/spec_id are hardcoded regardless of CSV content.
    expect((int) $student->section)->toBe(1);
    expect((int) $student->spec_id)->toBe(2);
});

test('dry run does not persist any records', function () {
    $csv = "Student ID,Full Name,Email\n2023-00011,Bob Builder,bob@example.com\n";

    $result = $this->service->importFromCsv(
        file: csvUploadFixture($csv),
        mapping: ['student_id' => 'Student ID', 'name' => 'Full Name', 'email' => 'Email'],
        action: 'skip',
        isDryRun: true,
    );

    expect($result['dry_run'])->toBeTrue();
    expect($result['stats']['to_create'])->toBe(1);
    expect(User::where('identity_no', '2023-00011')->exists())->toBeFalse();
});

test('existing user is updated when action is update', function () {
    $existing = User::factory()->create(['identity_no' => '2023-00012', 'name' => 'Old Name']);
    $csv = "Student ID,Full Name,Email\n2023-00012,New Name,new@example.com\n";

    $result = $this->service->importFromCsv(
        file: csvUploadFixture($csv),
        mapping: ['student_id' => 'Student ID', 'name' => 'Full Name', 'email' => 'Email'],
        action: 'update',
        isDryRun: false,
    );

    expect($result['stats']['to_update'])->toBe(1);
    expect($existing->fresh()->name)->toBe('New Name');
});

test('existing user is skipped when action is skip', function () {
    $existing = User::factory()->create(['identity_no' => '2023-00013', 'name' => 'Unchanged']);
    $csv = "Student ID,Full Name,Email\n2023-00013,Should Not Apply,skip@example.com\n";

    $result = $this->service->importFromCsv(
        file: csvUploadFixture($csv),
        mapping: ['student_id' => 'Student ID', 'name' => 'Full Name', 'email' => 'Email'],
        action: 'skip',
        isDryRun: false,
    );

    expect($result['stats']['to_skip'])->toBe(1);
    expect($existing->fresh()->name)->toBe('Unchanged');
});

test('rows with a missing student id are counted as errors and skipped', function () {
    $csv = "Student ID,Full Name,Email\n,No Id Here,noid@example.com\n";

    $result = $this->service->importFromCsv(
        file: csvUploadFixture($csv),
        mapping: ['student_id' => 'Student ID', 'name' => 'Full Name', 'email' => 'Email'],
        action: 'skip',
        isDryRun: false,
    );

    expect($result['stats']['errors'])->toBe(1);
    expect($result['stats']['to_create'])->toBe(0);
});

test('handles a BOM-prefixed CSV header row', function () {
    $csv = "\xEF\xBB\xBFStudent ID,Full Name,Email\n2023-00014,Bom Prefixed,bom@example.com\n";

    $result = $this->service->importFromCsv(
        file: csvUploadFixture($csv),
        mapping: ['student_id' => 'Student ID', 'name' => 'Full Name', 'email' => 'Email'],
        action: 'skip',
        isDryRun: false,
    );

    expect($result['stats']['to_create'])->toBe(1);
    expect(User::where('identity_no', '2023-00014')->exists())->toBeTrue();
});
