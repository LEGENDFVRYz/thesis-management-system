<?php

use App\Models\Faculty;
use App\Models\FacultyAssignment;
use App\Models\FacultyRole;
use App\Models\SchoolYear;
use App\Models\SectionAdviser;
use App\Models\Specialization;
use App\Models\Student;
use App\Models\Theses;
use App\Models\ThesisGroup;
use App\Models\User;
use App\Repositories\Student\StudentListingRepository;

beforeEach(function () {
    $this->repository = new StudentListingRepository;
});

test('listWithGroupAndAdviser returns the student with computed group_code and year_level', function () {
    $schoolYear = SchoolYear::factory()->create(['year' => 2023]);
    $adviserRole = FacultyRole::where('role_name', 'Adviser')->first();
    $faculty = Faculty::factory()->create([
        'name_prefix' => 'Dr.',
        'first_name' => 'Jane',
        'last_name' => 'Doe',
    ]);
    $assignment = FacultyAssignment::factory()->create([
        'faculty_id' => $faculty->id,
        'role_id' => $adviserRole->id,
        'sy_id' => $schoolYear->id,
        'is_active' => true,
    ]);
    $sectionAdviser = SectionAdviser::factory()->create([
        'section' => 2,
        'faculty_assign_id' => $assignment->id,
    ]);
    $group = ThesisGroup::factory()->create([
        'section_adviser_id' => $sectionAdviser->id,
        'group_number' => 5,
    ]);
    $specialization = Specialization::first() ?? Specialization::factory()->create();
    $user = User::factory()->create(['role' => 'student', 'identity_no' => '2023-00001']);
    $student = Student::factory()->create([
        'user_id' => $user->id,
        'group_id' => $group->id,
        'spec_id' => $specialization->id,
        'first_name' => 'John',
        'last_name' => 'Smith',
        'section' => 2,
    ]);
    Theses::factory()->create([
        'proposal_id' => \App\Models\Proposal::factory()->create(['group_id' => $group->id])->id,
        'title' => 'A Study on Testing',
    ]);

    // activeYear = 2025, schoolYear.year = 2023 -> year_level = 3 + (2025 - 2023) = 5
    $results = $this->repository->listWithGroupAndAdviser(activeYear: 2025);

    $row = collect($results)->firstWhere('student_number', '2023-00001');

    expect($row)->not->toBeNull();
    expect((int) $row->year_level)->toBe(5);
    expect($row->group_code)->toBe('5205'); // year_level(5) . section(2) . LPAD(group_number, 2, '0')(05)
    expect($row->student_name)->toBe('John Smith');
    expect($row->thesis_adviser)->toBe('Dr. Jane Doe');
});

test('listWithGroupAndAdviser still returns a student with no group via left joins', function () {
    $user = User::factory()->create(['role' => 'student', 'identity_no' => '2023-00002']);
    Student::factory()->create([
        'user_id' => $user->id,
        'group_id' => null,
        'first_name' => 'No',
        'last_name' => 'Group',
    ]);

    $results = $this->repository->listWithGroupAndAdviser(activeYear: 2025);

    $row = collect($results)->firstWhere('student_number', '2023-00002');

    expect($row)->not->toBeNull();
    expect($row->group_code)->toBeNull();
});
