<?php

namespace App\Repositories\Student;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Backs the Admin "Students" listing page:
 *
 * The group_code/year_level formula here is the "arithmetic" variant
 * (3 + (activeYear - schoolYear.year)). This is duplicated due to
 * event-based scenario of the system
 */
class StudentListingRepository
{
    /**
     * @return Collection<int, object>
     */
    public function listWithGroupAndAdviser(int $activeYear): Collection
    {
        return DB::table('tbl_students')
            ->leftJoin('users', 'tbl_students.user_id', '=', 'users.id')
            ->leftJoin('tbl_specializations', 'tbl_students.spec_id', '=', 'tbl_specializations.id')
            ->leftJoin('tbl_thesis_groups', 'tbl_students.group_id', '=', 'tbl_thesis_groups.id')
            ->leftJoin('tbl_section_advisers', 'tbl_thesis_groups.section_adviser_id', '=', 'tbl_section_advisers.id')
            ->leftJoin('tbl_faculty_assignments', 'tbl_section_advisers.faculty_assign_id', '=', 'tbl_faculty_assignments.id')
            ->leftJoin('tbl_school_years', 'tbl_faculty_assignments.sy_id', '=', 'tbl_school_years.id')
            ->leftJoin('tbl_faculties', 'tbl_faculty_assignments.faculty_id', '=', 'tbl_faculties.id')
            ->leftJoin('tbl_proposals', 'tbl_thesis_groups.id', '=', 'tbl_proposals.group_id')
            ->leftJoin('tbl_theses', 'tbl_proposals.id', '=', 'tbl_theses.proposal_id')
            ->select(
                // --- Simple Columns ---
                'users.identity_no as student_number',
                'users.email',
                'tbl_students.section as block',
                'tbl_specializations.spec_name as specialization',

                // --- Concatenated Student Name ---
                DB::raw("CONCAT(tbl_students.first_name, ' ', tbl_students.last_name) as student_name"),

                // --- Concatenated Adviser Name ---
                DB::raw("CONCAT(tbl_faculties.name_prefix, ' ', tbl_faculties.first_name, ' ', tbl_faculties.last_name) as thesis_adviser"),

                // --- Group Code Logic ---
                DB::raw("
                    CONCAT(
                        (3 + ($activeYear - tbl_school_years.year)),
                        tbl_section_advisers.section,
                        LPAD(tbl_thesis_groups.group_number, 2, '0')
                    ) AS group_code
                "),

                DB::raw("(3 + ($activeYear - tbl_school_years.year)) as year_level"),
                DB::raw('MAX(tbl_theses.title) as thesis_title')
            )
            ->groupBy(
                'tbl_students.id',
                'users.identity_no',
                'users.email',
                'tbl_students.section',
                'tbl_students.first_name',
                'tbl_students.last_name',
                'tbl_specializations.spec_name',
                'tbl_faculties.name_prefix',
                'tbl_faculties.first_name',
                'tbl_faculties.last_name',
                'tbl_school_years.year',
                'tbl_section_advisers.section',
                'tbl_thesis_groups.group_number'
            )
            ->orderBy('tbl_students.id', 'asc')
            ->get();
    }
}
