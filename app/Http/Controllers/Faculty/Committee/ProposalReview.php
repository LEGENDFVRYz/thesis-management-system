<?php

namespace App\Http\Controllers\Faculty\Committee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class ProposalReview extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        // TASK 1.4: Trisha     --part 1/2

        // check for filtes

        // Main Query -- note: makesure you query also the other committee approval status

        // Seperate data by "pending" "under" "evaluated"

        // Render and send props
    $userId = Auth::id();

        // Current Academic Year
        $currentSyId = DB::table('tbl_faculty_assignments')->max('sy_id');

        // ================= MAIN QUERY =================
        $query = DB::table('tbl_proposals as p')
            ->join('tbl_thesis_groups as tg', 'p.group_id', '=', 'tg.id')
            ->join('tbl_section_advisers as sa', 'tg.section_adviser_id', '=', 'sa.id')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->join('users as u_advisor', 'f.user_id', '=', 'u_advisor.id')

            // Logged-in committee member evaluation
            ->leftJoin('tbl_proposal_evaluations as my_eval', function ($join) use ($userId) {
                $join->on('p.id', '=', 'my_eval.proposal_id')
                     ->where('my_eval.evaluator_id', '=', $userId);
            })

            ->where('fa.sy_id', $currentSyId)

            ->select([
                'p.id as proposal_id',
                'p.proposal_title',
                'p.proposal_filepath',
                DB::raw("DATE_FORMAT(p.created_at, '%M %d, %Y') as submitted_date"),

                'u_advisor.name as advisor_name',
                'sa.section as block',

                'my_eval.is_approved as my_status',
                'my_eval.comment as my_comment',

                DB::raw("(SELECT GROUP_CONCAT(CONCAT(s.first_name, ' ', s.last_name) SEPARATOR ', ')
                          FROM tbl_students s
                          WHERE s.group_id = tg.id) as proponents")
            ])

            ->groupBy(
                'p.id',
                'p.proposal_title',
                'p.proposal_filepath',
                'p.created_at',
                'u_advisor.name',
                'sa.section',
                'my_eval.is_approved',
                'my_eval.comment',
                'tg.id'
            );

        // ================= FILTER =================
        if ($request->filled('status')) {
            match ($request->status) {
                'approved' => $query->where('my_eval.is_approved', 1),
                'rejected' => $query->where('my_eval.is_approved', 0),
                'pending'  => $query->whereNull('my_eval.is_approved'),
                default    => null
            };
        }

        $proposals = $query->get();

        // ================= GROUPING =================
        $grouped = $proposals->groupBy(fn ($p) =>
            is_null($p->my_status) ? 'pending' : 'evaluated'
        );

        $data = [
            'pending'      => $grouped->get('pending', collect())->values(),
            'evaluated'    => $grouped->get('evaluated', collect())->values(),
        ];

        // ================= DEBUG (REMOVE AFTER CHECK) =================
        dd($data);

        return Inertia::render(
            'Faculty/management/committee/proposal_review',
            ['proposals' => $data,
             'filters'   => $request->only('status'),
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
        // TASK 1.4: Trisha     --part 2/2
        // Note: Granted permission, you can add new route in routes/web.php dependent on your logic

        // Used the testing modal to create a group and get all need information

        // Saved it into the database
        $request->validate([
            'proposal_id' => 'required|exists:tbl_proposals,id',
            'is_approved' => 'required|boolean',
            'comment'     => 'nullable|string',
        ]);

            $evaluatorId = Auth::id();
        $proposalId  = $request->proposal_id;

        $exists = DB::table('tbl_proposal_evaluations')
            ->where('proposal_id', $proposalId)
            ->where('evaluator_id', $evaluatorId)
            ->exists();

        if ($exists) {
            // Row exists → update only
            DB::table('tbl_proposal_evaluations')
                ->where('proposal_id', $proposalId)
                ->where('evaluator_id', $evaluatorId)
                ->update([
                    'is_approved' => $request->is_approved,
                    'comment'     => $request->comment,
                    'updated_at'  => now(),
                ]);
        } else {
            // Row does not exist → insert with created_at
            DB::table('tbl_proposal_evaluations')->insert([
                'proposal_id'  => $proposalId,
                'evaluator_id' => $evaluatorId,
                'is_approved'  => $request->is_approved,
                'comment'      => $request->comment,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
    }
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