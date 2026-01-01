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
            
            // Join to get Adviser's Faculty Assignment
            ->join('tbl_faculty_assignments as adviser_fa', 'sa.faculty_assign_id', '=', 'adviser_fa.id')
            
            // Join to get Adviser's Faculty Info
            ->join('tbl_faculties as adviser_faculty', 'adviser_fa.faculty_id', '=', 'adviser_faculty.id')
            
            // Join to Defense Matrices (for panel connection)
            ->leftJoin('tbl_defense_matrices as dm', 'e.id', '=', 'dm.endorsement_id')
            
            // Join to Endorsed Panels
            ->leftJoin('tbl_endorsed_panels as ep', 'dm.id', '=', 'ep.defense_matrix_id')
            
            // Join to Panel's Faculty Assignment
            ->leftJoin('tbl_faculty_assignments as panel_fa', 'ep.panel_id', '=', 'panel_fa.id')
            
            // Join to Panel's Faculty Info
            ->leftJoin('tbl_faculties as panel_faculty', 'panel_fa.faculty_id', '=', 'panel_faculty.id')
            
            ->select(
                // Thesis Title
                't.title as thesis_title',
                
                // Group Code (section + group_number format)
                DB::raw("CONCAT(sa.section, '-', g.group_number) AS group_code"),
                
                // Endorsement Status
                'e.is_adviser_approved',
                'e.updated_at as endorsement_updated_at',
                
                // Section
                'sa.section',
                
                // Adviser Full Name (from section adviser path)
                DB::raw("
                    CONCAT_WS(' ',
                        adviser_faculty.name_prefix,
                        adviser_faculty.first_name,
                        adviser_faculty.middle_name,
                        adviser_faculty.last_name
                    ) AS adviser_name
                "),
                
                // Panel Members (concatenated)
                DB::raw("
                    GROUP_CONCAT(
                        DISTINCT CONCAT_WS(' ',
                            panel_faculty.name_prefix,
                            panel_faculty.first_name,
                            panel_faculty.middle_name,
                            panel_faculty.last_name
                        )
                        SEPARATOR ', '
                    ) AS panel_members
                ")
            )
            /* Remove this comment block to enable filtering (adviser specific and approved by adviser and coordinator)

            // KEY VERIFICATION: Only endorsements under THIS adviser's section
            ->where('adviser_faculty.user_id', $userId)

            // Filter for valid endorsements (both adviser and coordinator approved)
            ->where('e.is_adviser_approved', 1)
            ->where('e.is_coordinator_approved', 1)
            */
            ->groupBy(
                'e.id',
                't.title',
                'sa.section',
                'g.group_number',
                'e.is_adviser_approved',
                'e.updated_at',
                'adviser_faculty.name_prefix',
                'adviser_faculty.first_name',
                'adviser_faculty.middle_name',
                'adviser_faculty.last_name'
            )
            
            ->orderBy('e.updated_at', 'desc')
            ->get();
            
        dd(vars: $validEndorsements);
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
