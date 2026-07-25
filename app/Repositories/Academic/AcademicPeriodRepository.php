<?php

namespace App\Repositories\Academic;

use App\Models\SchoolYear;
use App\Models\Semester;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Centralizes lookup:
 *     - "currently active school year / semester"
 */
class AcademicPeriodRepository
{
    /**
     * The currently active Semester, with its SchoolYear eager loaded.
     */
    public function activeSemester(): ?Semester
    {
        return Semester::with('schoolYear')
            ->where('is_active', true)
            ->first();
    }

    /**
     * Mirrors AcademicSettingController::index() existing Eloquent lookup.
     */
    public function activeSchoolYear(): ?SchoolYear
    {
        return $this->activeSemester()?->schoolYear;
    }

    /**
     * School years (with their semesters) between $fromYear and $toYear
     * inclusive, keyed by year — the data set AcademicSettingController's
     * dropdown/date-range pickers are built from.
     *
     * @return Collection<int, SchoolYear>
     */
    public function schoolYearsBetween(int $fromYear, int $toYear): Collection
    {
        return SchoolYear::with('semesters')
            ->whereBetween('year', [$fromYear, $toYear])
            ->get()
            ->keyBy('year');
    }

    /**
     * Mirrors "join tbl_school_years to tbl_semesters where
     * is_active" pattern duplicated across difference controllers.
     *
     *     - $fallback is optional (current year by default)
     */
    public function activeYearOrDefault(?int $fallback = null): int
    {
        $fallback ??= (int) date('Y');

        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year');

        return $activeYear ?? $fallback;
    }
}
