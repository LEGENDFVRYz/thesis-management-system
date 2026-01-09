<?php

namespace App\Http\Controllers\Faculty\Adviser;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class Endorsement extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 2.2: Arnel      --part 1/2

        // Get the logged-in adviser's user ID

        // 1. GET ACTIVE SCHOOL YEAR (Needed for the calculation)
        $activeYear = DB::table('tbl_school_years')
            ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
            ->where('tbl_semesters.is_active', true)
            ->value('year');

        // Fallback safety
        $activeYear = $activeYear ?? date('Y');

        $userId = Auth::id();

        // Query all the valid endorsements under this adviser's section
        $validEndorsements = DB::table('tbl_endorsements as e')
            // Join to Theses
            ->join('tbl_theses as t', 'e.thesis_id', '=', 't.id')

            // Join to Proposals
            ->join('tbl_proposals as p', 't.proposal_id', '=', 'p.id')

            // Join to Thesis Groups
            ->join('tbl_thesis_groups as g', 'p.group_id', '=', 'g.id')

            // Join to Section Advisers
            ->join('tbl_section_advisers as sa', 'g.section_adviser_id', '=', 'sa.id')

            // Join to Students (to get student names)
            ->leftJoin('tbl_students as s', 'g.id', '=', 's.group_id')

            // Join to get Adviser's Faculty Assignment
            ->join('tbl_faculty_assignments as adviser_fa', 'sa.faculty_assign_id', '=', 'adviser_fa.id')

            // Join to get Adviser's Faculty Info
            ->join('tbl_faculties as adviser_faculty', 'adviser_fa.faculty_id', '=', 'adviser_faculty.id')

            ->join('tbl_school_years as sy', 'adviser_fa.sy_id', '=', 'sy.id')
            ->leftJoin('tbl_defense_matrices as dm', 'e.id', '=', 'dm.endorsement_id')

            ->select(
                // Endorsement ID
                'e.id as endorsement_id',

                // Thesis Title
                't.title as thesis_title',

                // Manuscript File Path for Document Preview
                't.manuscript_filepath',

                // Course
                'dm.course',

                // Group Code (New Group Code Format)
                DB::raw("CONCAT(
                    (3 + ($activeYear - sy.year)), 
                    sa.section, 
                    LPAD(g.group_number, 2, '0')
                ) AS group_code"),

                // Year Level
                DB::raw("(3 + ($activeYear - sy.year)) as year_level"),

                // Endorsement Status
                'e.is_adviser_approved',
                'e.updated_at as endorsement_updated_at',

                // Section (used as block)
                'sa.section as block',

                // Adviser Full Name (from section adviser path)
                DB::raw("
                    CONCAT_WS(' ',
                        adviser_faculty.name_prefix,
                        adviser_faculty.first_name,
                        adviser_faculty.middle_name,
                        adviser_faculty.last_name
                    ) AS adviser_name
                "),

                // Student Names (concatenated for all group members)
                DB::raw("
                    GROUP_CONCAT(
                        DISTINCT CONCAT_WS(' ', s.first_name, s.middle_name, s.last_name)
                        ORDER BY s.last_name
                        SEPARATOR ', '
                    ) AS student_names
                ")
            )

        
            // KEY VERIFICATION: Only endorsements under THIS adviser's section 
            //remove this comment to enable filtering by logged-in adviser
            ->where('adviser_faculty.user_id', $userId)

            
            ->groupBy(
                'e.id',
                't.title',
                't.manuscript_filepath', 
                'dm.course',
                'sa.section',
                'g.group_number',
                'e.is_adviser_approved',
                'e.updated_at',
                'adviser_faculty.name_prefix',
                'adviser_faculty.first_name',
                'adviser_faculty.middle_name',
                'adviser_faculty.last_name',
                'sy.year'
            )
            
            ->orderBy('e.is_adviser_approved', 'asc')
            ->get();
            
    //    dd(vars: $validEndorsements);
        return Inertia::render('Faculty/management/adviser/endorsements', [
            'endorsements' => $validEndorsements
        ]);
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
    public function show(string $id)
    {
        //
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
        // TASK 2.2: Arnel      --part 2/2

        // Toggle the boolean marker for "is_adviser_approved" when approve
        DB::table('tbl_endorsements')
            ->where('id', $id)
            ->update([
                'is_adviser_approved' => true,
                'updated_at' => now()
            ]);
        // SAved to DB  
        return back()->with('success', 'Endorsement approved successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
