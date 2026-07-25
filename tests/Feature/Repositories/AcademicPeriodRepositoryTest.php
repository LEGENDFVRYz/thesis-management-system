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
