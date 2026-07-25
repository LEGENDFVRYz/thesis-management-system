<?php

namespace App\Repositories\Academic;

use App\Models\SchoolYear;
use App\Models\Semester;
use Illuminate\Support\Facades\DB;

/**
 * Centralizes the "what is the currently active school year / semester"
 * lookup that is duplicated (in raw-DB and Eloquent forms, with different
 * fallback values) across several Admin and Student controllers.
 *
 * This repository intentionally does NOT unify the differing fallback
 * values used at each call site (some use 2025, some use date('Y')) — the
 * fallback is a required parameter so each caller keeps its own current
 * behavior exactly, byte-for-byte, until that inconsistency is explicitly
 * decided on separately.
 */
class AcademicPeriodRepository
{
    /**
     * Mirrors AcademicSettingController::index()'s existing Eloquent lookup.
     */
    public function activeSchoolYear(): ?SchoolYear
    {
        $active = Semester::with('schoolYear')
            ->where('is_active', true)
            ->first();

        return $active?->schoolYear;
    }

    /**
     * Mirrors the raw-DB "join tbl_school_years to tbl_semesters where
     * is_active" pattern duplicated across StudentController, FacultyController,
     * DefenseController, MatrixController, and EvaluationController.
     *
     * $fallback is required (not defaulted) so each call site must state its
     * own existing fallback explicitly, rather than this repository silently
     * picking one.
     */
    public function activeYearOrDefault(int $fallback): int
    {
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year');

        return $activeYear ?? $fallback;
    }
}
