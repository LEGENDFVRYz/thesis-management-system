<?php

namespace App\Http\Controllers\Faculty\Adviser\AdviseeManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MyAdvisees extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    { $UserID = $request->user()->id;
        $search = $request->query('search');
        $students = DB::table('tbl_students as s')
            ->leftJoin('users as student_user', 's.user_id', '=', 'student_user.id')
            ->join('tbl_section_advisers as sa', 's.section', '=', 'sa.section')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->leftJoin('tbl_thesis_groups as tg', 's.group_id', '=', 'tg.id')
            ->leftJoin('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->leftJoin('tbl_proposals as p', 'p.group_id', '=', 'tg.id')
            ->leftJoin('tbl_theses as th', 'th.proposal_id', '=', 'p.id')
            ->leftJoin('tbl_students as co', function ($join) {
                $join->on('co.group_id', '=', 's.group_id')
                     ->whereColumn('co.id', '!=', 's.id');
            })

            ->where('f.user_id', $UserID)
            ->where('fa.role_id', 2)
            // ADD SEARCH FILTER
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('student_user.identity_no', 'LIKE', "%$search%")
                      ->orWhere(DB::raw("CONCAT(s.first_name, ' ', s.last_name)"), 'LIKE', "%$search%")
                      ->orWhere('p.proposal_title', 'LIKE', "%$search%");
                });
            })

            ->groupBy(
                's.id',
                'student_user.identity_no',
                'student_user.email',
                's.first_name',
                's.last_name',
                'sy.year',
                'sa.section',
                'tg.group_number',
                's.is_leader'
            )

            ->selectRaw("
                MAX(student_user.identity_no) AS student_id,
                MAX(student_user.email) AS pup_webmail,
                MAX(CONCAT(s.first_name, ' ', s.last_name)) AS student_name,

                CONCAT('BSCPE ', 3 - (sy.year - 2025), '-', sa.section) AS block,

                CONCAT(3 - (sy.year - 2025), sa.section, LPAD(tg.group_number, 2, '0')) AS group_code,

                s.is_leader,

                MAX(p.proposal_title) AS thesis_title,

                GROUP_CONCAT(DISTINCT CONCAT(co.first_name, ' ', co.last_name) SEPARATOR ', ') AS co_researchers,

                CASE
                    WHEN MAX(p.id) IS NULL THEN 'No Proposal'
                    WHEN MAX(p.is_pursued) = 0 THEN 'Proposal Pending'
                    WHEN MAX(p.is_pursued) = 1 AND MAX(th.id) IS NULL THEN 'Proposal Approved'
                    WHEN MAX(th.id) IS NOT NULL AND MAX(th.manuscript_filepath) IS NULL THEN 'Thesis Draft'
                    WHEN MAX(th.manuscript_filepath) IS NOT NULL THEN 'Thesis Manuscript'
                    ELSE 'Unknown'
                END AS thesis_stage,

                CASE
                    WHEN MAX(p.id) IS NULL THEN 0
                    WHEN MAX(p.is_pursued) = 0 THEN 10
                    WHEN MAX(p.is_pursued) = 1 AND MAX(th.id) IS NULL THEN 40
                    WHEN MAX(th.id) IS NOT NULL AND MAX(th.manuscript_filepath) IS NULL THEN 60
                    WHEN MAX(th.manuscript_filepath) IS NOT NULL THEN 80
                    ELSE 0
                END AS progress
            ")

            ->orderBy('s.last_name')
            ->simplePaginate(25);

        //dd($students);
        return Inertia::render(
            'Faculty/management/adviser/advisee_management/my_advisees',
            [
                'advisees' => $students,
                'search' => $search,
            ]
        );
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $studentUserId)
    {
        $facultyUserId = auth()->id();

        $student = DB::table('tbl_students as s')
            ->leftJoin('users as student_user', 's.user_id', '=', 'student_user.id')
            ->join('tbl_section_advisers as sa', 's.section', '=', 'sa.section')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')

            ->select([
                'student_user.identity_no as student_id',
                'student_user.email as pup_webmail',
                's.last_name',
                's.first_name',
                's.group_id',
                's.section',
                's.is_leader',
            ])

            ->where('f.user_id', $facultyUserId)
            ->where('fa.role_id', 2)
            ->where('s.user_id', $studentUserId)
            ->first();

        abort_if(!$student, 404);

        return response()->json($student);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}