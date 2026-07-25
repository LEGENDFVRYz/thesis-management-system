<?php

namespace App\Services;

use App\Models\SchoolYear;
use App\Models\Semester;
use App\Models\User;
use App\Notifications\AcademicYearAnnounced;
use Illuminate\Support\Facades\DB;
use Notification;

/**
 * Business logic behind the Academic Settings admin page:
 * updating semester schedule, and updating/creating a school year
 *
 * This services contains:
 *    #1 - Update Semester
 *    #2 - Update Academic Year
 *  
      Helper 1 - Notification Sender
 */
class AcademicSettingService
{
    /**
     * SCENARIO 1: Update (or create) a semester's schedule for a given
     * school year, deactivating all other semesters first.
     */
    public function updateSemester(array $validated): Semester
    {
        $schoolYear = SchoolYear::where('year', $validated['sy_year'])->first();

        if (! $schoolYear) {
            throw new \RuntimeException('School year not found. Create the year first.');
        }

        $newSemester = DB::transaction(function () use ($schoolYear, $validated) {
            Semester::query()->update(['is_active' => false]);

            return Semester::updateOrCreate(
                [
                    'school_year_id' => $schoolYear->id,
                    'semester' => $validated['sem_index'],
                ],
                [
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'is_active' => true,
                ]
            );
        });

        $this->announceAcademicPeriodChange($newSemester);

        return $newSemester;
    }

    /**
     * SCENARIO 2: Update (or create) a school year, force-activate its
     * first semester.
     */
    public function updateAcademicYear(array $validated): Semester
    {
        $schoolYear = SchoolYear::updateOrCreate(
            ['year' => $validated['year']],
            [
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ]
        );

        $newSemester = DB::transaction(function () use ($schoolYear) {
            Semester::query()->update(['is_active' => false]);

            // Force Activate the First Semester (temporary soln -- depends, maybe we used the activeSemester)
            return Semester::updateOrCreate(
                [
                    'school_year_id' => $schoolYear->id,
                    'semester' => 0,
                ],
                [
                    'is_active' => true,
                ]
            );
        });

        $this->announceAcademicPeriodChange($newSemester);

        return $newSemester;
    }

    /**
     * -------------------------------------------------------------------------
     * **Helper** - Notification Sender
     * Clears unread AcademicYearAnnounced notifications and broadcasts the
     * newly active academic period to all users.
     */
    private function announceAcademicPeriodChange(Semester $semester): void
    {
        DB::table('notifications')
            ->where('type', AcademicYearAnnounced::class) // Target this specific notification class
            ->whereNull('read_at') // Only remove them if they haven't been read yet
            ->delete();

        Notification::send(User::all(), new AcademicYearAnnounced($semester->load('schoolYear')));
    }
}
