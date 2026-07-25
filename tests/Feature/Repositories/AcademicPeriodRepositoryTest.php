<?php

use App\Models\SchoolYear;
use App\Models\Semester;
use App\Repositories\Academic\AcademicPeriodRepository;

beforeEach(function () {
    $this->repository = new AcademicPeriodRepository;
});

test('activeSchoolYear returns the school year of the active semester', function () {
    $schoolYear = SchoolYear::factory()->create(['year' => 2025]);
    Semester::factory()->create([
        'school_year_id' => $schoolYear->id,
        'is_active' => true,
    ]);

    $result = $this->repository->activeSchoolYear();

    expect($result)->not->toBeNull();
    expect($result->id)->toBe($schoolYear->id);
    expect($result->year)->toBe(2025);
});

test('activeSchoolYear returns null when no semester is active', function () {
    $schoolYear = SchoolYear::factory()->create(['year' => 2025]);
    Semester::factory()->create([
        'school_year_id' => $schoolYear->id,
        'is_active' => false,
    ]);

    expect($this->repository->activeSchoolYear())->toBeNull();
});

test('activeYearOrDefault returns the active semester year', function () {
    $schoolYear = SchoolYear::factory()->create(['year' => 2027]);
    Semester::factory()->create([
        'school_year_id' => $schoolYear->id,
        'is_active' => true,
    ]);

    expect($this->repository->activeYearOrDefault(fallback: 2025))->toBe(2027);
});

test('activeYearOrDefault returns the given fallback when no semester is active', function () {
    expect($this->repository->activeYearOrDefault(fallback: 2025))->toBe(2025);
    expect($this->repository->activeYearOrDefault(fallback: (int) date('Y')))->toBe((int) date('Y'));
});

test('activeYearOrDefault defaults to the current year when no fallback is given', function () {
    expect($this->repository->activeYearOrDefault())->toBe((int) date('Y'));
});

test('activeSemester returns the active semester with its school year loaded', function () {
    $schoolYear = SchoolYear::factory()->create(['year' => 2025]);
    $semester = Semester::factory()->create([
        'school_year_id' => $schoolYear->id,
        'semester' => 1,
        'is_active' => true,
    ]);

    $result = $this->repository->activeSemester();

    expect($result)->not->toBeNull();
    expect($result->id)->toBe($semester->id);
    expect($result->schoolYear->id)->toBe($schoolYear->id);
});

test('activeSemester returns null when no semester is active', function () {
    expect($this->repository->activeSemester())->toBeNull();
});

test('schoolYearsBetween returns school years with semesters keyed by year within range', function () {
    $inRange = SchoolYear::factory()->create(['year' => 2025]);
    Semester::factory()->create(['school_year_id' => $inRange->id]);
    SchoolYear::factory()->create(['year' => 2020]);

    $result = $this->repository->schoolYearsBetween(2024, 2026);

    expect($result->keys()->all())->toBe([2025]);
    expect($result->get(2025)->id)->toBe($inRange->id);
    expect($result->get(2025)->semesters)->toHaveCount(1);
});
