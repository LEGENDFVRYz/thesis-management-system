<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ThesisArchive extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 2.1: Arnel      --part 1/2

        // Main Query: Query the title, date, tags, author ( and id for linking in DB )

        $archives = DB::table('tbl_archived_journals')
            // 1. Join Theses (For Title)
            ->leftJoin('tbl_theses', 'tbl_archived_journals.thesis_id', '=', 'tbl_theses.id')
            
            // 2. Join Proposals (For Group ID)
            ->leftJoin('tbl_proposals', 'tbl_theses.proposal_id', '=', 'tbl_proposals.id')
            
            // 3. Join Thesis Groups (To link to Students)
            ->leftJoin('tbl_thesis_groups', 'tbl_proposals.group_id', '=', 'tbl_thesis_groups.id')
            
            // 4. Join Students (For Names and User IDs)
            ->leftJoin('tbl_students', 'tbl_thesis_groups.id', '=', 'tbl_students.group_id')
            
            ->select(
                // --- Simple Columns ---
                'tbl_archived_journals.id as journal_id', // journal_id for linking to show page
                'tbl_theses.title as title',
                'tbl_archived_journals.created_at as date_archived',
                'tbl_archived_journals.keywords as tags',
                
                // --- Concatenated Author Names ---
                DB::raw("GROUP_CONCAT(CONCAT(tbl_students.first_name, ' ', tbl_students.last_name) SEPARATOR ', ') as authors"),
                
                // --- Concatenated User IDs for Backend Linking ---
                DB::raw("GROUP_CONCAT(tbl_students.user_id SEPARATOR ',') as author_user_ids")
            )
            ->groupBy(
                'tbl_archived_journals.id',
                'tbl_theses.title',
                'tbl_archived_journals.created_at',
                'tbl_archived_journals.keywords'
            )
            ->orderBy('tbl_archived_journals.created_at', 'desc')
            ->get(); // Use ->paginate(10) if you want pagination
        
        // Render and Send props originally Shared/repository/thesis
        return Inertia::render('Guest/repository', [
            'archives' => $archives
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
        // TASK 2.1: Arnel      --part 2/2
         // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Show selected archive thesis information
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
