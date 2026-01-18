<?php

namespace App\Http\Controllers\Faculty\Adviser\AdviseeManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupComp extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TASK 2.3: Arnel  --part 1/3

        // Get the logged-in adviser's user ID
        $userId = Auth::id();

        $activeYear = DB::table('tbl_school_years')
    ->join('tbl_semesters', 'tbl_school_years.id', '=', 'tbl_semesters.school_year_id')
    ->where('tbl_semesters.is_active', 1)
    ->select(DB::raw('COALESCE(tbl_school_years.year, YEAR(CURDATE())) as active_year'))
    ->value('active_year');

        // Main Query - adapted from MySQL query with $userId filter
        $students = DB::table('tbl_faculties as adviser')
            // Join: Faculties -> Faculty Assignments
            ->join('tbl_faculty_assignments as fa', 'adviser.id', '=', 'fa.faculty_id')
            // Join: Faculty Assignments -> Section Advisers
            ->join('tbl_section_advisers as sa', 'fa.id', '=', 'sa.faculty_assign_id')
            // Join: Section Advisers -> Thesis Groups
            ->join('tbl_thesis_groups as tg', 'sa.id', '=', 'tg.section_adviser_id')
            // LEFT JOIN: Thesis Groups -> Proposals (pursued only)
            ->leftJoin('tbl_proposals as p', function ($join) {
                $join->on('tg.id', '=', 'p.group_id')
                    ->whereNull('p.deleted_at')
                    ->where('p.is_pursued', '=', 1);
            })
            // LEFT JOIN: Proposals -> Theses
            ->leftJoin('tbl_theses as t', 'p.id', '=', 't.proposal_id')
            // LEFT JOIN: Theses -> Endorsements
            ->leftJoin('tbl_endorsements as e', 't.id', '=', 'e.thesis_id')
            // Join: Thesis Groups -> Students
            ->join('tbl_students as s', 'tg.id', '=', 's.group_id')
            // Join: Students -> Users
            ->join('users as u', 's.user_id', '=', 'u.id')
            // LEFT JOIN: Faculty Assignments -> School Years
            ->leftJoin('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            // Filter by logged-in adviser's user ID
            ->where('adviser.user_id', $userId)
            // Group by essential fields
            ->groupBy([
                'tg.id',
                'tg.group_number',
                'tg.section_adviser_id',
                'sa.section',
                't.title',
                'sy.year',
                'adviser.name_prefix',
                'adviser.first_name',
                'adviser.last_name',
                's.id',
                's.first_name',
                's.last_name',
                's.is_leader',
                'u.identity_no',
                'u.email',
            ])
            ->orderBy('defense_id')
            ->orderBy('s.last_name', 'asc')
            ->select([
                // Defense ID / Group Code
                DB::raw("CONCAT(
                    (3 + ($activeYear - sy.year)),
                    sa.section,
                    LPAD(tg.group_number, 2, '0')
                ) AS defense_id"),
                // Thesis Title
                't.title',
                // Student ID (Identity Number)
                'u.identity_no as student_id',
                // Student Name
                DB::raw("CONCAT(s.first_name, ' ', s.last_name) as student_name"),
                // Student Program and Section
                DB::raw("CONCAT('BSCPE ', (3 + ($activeYear - sy.year)), '-', sa.section) as student_program_section"),
                // Student Email
                'u.email as student_email',
                // Group Number
                'tg.group_number',
                // Section
                'sa.section',
                // Year Level (computed)
                DB::raw("(3 + ($activeYear - sy.year)) as year_level"),
                // Group Code (same as defense_id)
                DB::raw("CONCAT(
                    (3 + ($activeYear - sy.year)),
                    sa.section,
                    LPAD(tg.group_number, 2, '0')
                ) AS group_code"),
                // Adviser Name (with prefix)
                DB::raw("CONCAT(adviser.name_prefix, ' ', adviser.first_name, ' ', adviser.last_name) as adviser_name"),
                // Critical fields for modals/CRUD operations
                'tg.id as group_id',
                'tg.section_adviser_id',
                's.is_leader',
            ])
            ->get();
        // Get section advisers for the logged-in adviser (for block dropdown)
        $sectionAdvisers = DB::table('tbl_section_advisers as sa')
            ->join('tbl_faculty_assignments as fa', 'sa.faculty_assign_id', '=', 'fa.id')
            ->join('tbl_faculties as f', 'fa.faculty_id', '=', 'f.id')
            ->leftJoin('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->join('tbl_semesters as sem', 'sy.id', '=', 'sem.school_year_id')
            ->where('f.user_id', $userId)
            ->where('fa.is_active', 1)
            // ->where('sem.is_active', 1) 
            ->select([
                'sa.id as section_adviser_id',
                'sa.section',
                DB::raw("(3 + ($activeYear - sy.year)) as year_level"),
            ])
            ->distinct()
            ->get();

        // Get students without a thesis group (for create group dropdown)
        $studentsWithoutGroup = DB::table('tbl_faculties as adviser')
            ->join('tbl_faculty_assignments as fa', 'adviser.id', '=', 'fa.faculty_id')
            ->join('tbl_section_advisers as sa', 'fa.id', '=', 'sa.faculty_assign_id')
            ->leftJoin('tbl_school_years as sy', 'fa.sy_id', '=', 'sy.id')
            ->join('tbl_semesters as sem', 'sy.id', '=', 'sem.school_year_id')
            ->join('tbl_students as s', 'sa.section', '=', 's.section')
            ->join('users as u', 's.user_id', '=', 'u.id')
            ->where('adviser.user_id', $userId)
            ->where('fa.is_active', 1)
            ->where('sem.is_active', 1)
            ->whereNull('s.group_id')
            ->groupBy([
                's.id',
                's.last_name',
                's.first_name',
                's.middle_name',
                'u.identity_no',
                'u.email',
                's.section',
                'sy.year',
            ])
            ->orderBy('s.last_name')
            ->orderBy('s.first_name')
            ->select([
                's.id',
                DB::raw("CONCAT(s.last_name, ', ', s.first_name, ' ', COALESCE(s.middle_name, '')) AS student_name"),
                'u.identity_no as student_number',
                'u.email',
                's.section',
                DB::raw("(3 + ($activeYear - sy.year)) as year_level"),
            ])
            ->get();
        return Inertia::render('Faculty/management/adviser/advisee_management/group_comp', [
            'students' => $students,
            'sectionAdvisers' => $sectionAdvisers,
            'studentsWithoutGroup' => $studentsWithoutGroup,
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
        // Validate the request
        $validated = $request->validate([
            'section_adviser_id' => 'required|exists:tbl_section_advisers,id',
            'members' => 'required|array|min:2|max:4',
            'members.*.studentNumber' => 'required|string',
            'members.*.isLeader' => 'required|boolean',
        ]);

        // Verify exactly one leader exists
        $leaderCount = collect($validated['members'])->where('isLeader', true)->count();
        if ($leaderCount !== 1) {
            return back()->withErrors(['members' => 'Exactly one member must be designated as leader.']);
        }

        // Generate the next group number for this section adviser
        $maxGroupNumber = DB::table('tbl_thesis_groups')
            ->where('section_adviser_id', $validated['section_adviser_id'])
            ->max('group_number') ?? 0;
        $newGroupNumber = $maxGroupNumber + 1;

        // Create the thesis group
        $groupId = DB::table('tbl_thesis_groups')->insertGetId([
            'section_adviser_id' => $validated['section_adviser_id'],
            'group_number' => $newGroupNumber,
        ]);

        // Collect student IDs and check for existing proposals from old groups
        $studentIds = [];
        foreach ($validated['members'] as $member) {
            // Find student by student number (identity_no in users table)
            $student = DB::table('tbl_students as s')
                ->join('users as u', 's.user_id', '=', 'u.id')
                ->where('u.identity_no', $member['studentNumber'])
                ->select('s.id')
                ->first();

            if ($student) {
                $studentIds[] = $student->id;

                DB::table('tbl_students')
                    ->where('id', $student->id)
                    ->update([
                        'group_id' => $groupId,
                        'is_leader' => $member['isLeader'],
                        'updated_at' => now(),
                    ]);
            }
        }

        // Transfer proposals from orphaned groups (groups with no students) to the new group
        // Find groups that have proposals but no students assigned (orphaned after deletion)
        $orphanedGroupsWithProposals = DB::table('tbl_thesis_groups as tg')
            ->join('tbl_proposals as p', 'tg.id', '=', 'p.group_id')
            ->leftJoin('tbl_students as s', 'tg.id', '=', 's.group_id')
            ->whereNull('s.id') // No students in the group
            ->whereNull('p.deleted_at')
            ->where('tg.section_adviser_id', $validated['section_adviser_id']) // Same section adviser
            ->select('tg.id as old_group_id', 'p.id as proposal_id')
            ->get();

        if ($orphanedGroupsWithProposals->isNotEmpty()) {
            // Transfer proposals to the new group
            $proposalIds = $orphanedGroupsWithProposals->pluck('proposal_id')->toArray();
            DB::table('tbl_proposals')
                ->whereIn('id', $proposalIds)
                ->update([
                    'group_id' => $groupId,
                    'updated_at' => now(),
                ]);

            // Delete the orphaned groups (now safe since proposals are transferred)
            $orphanedGroupIds = $orphanedGroupsWithProposals->pluck('old_group_id')->unique()->toArray();
            DB::table('tbl_thesis_groups')
                ->whereIn('id', $orphanedGroupIds)
                ->delete();
        }

        return redirect()->route('faculty.adviser.group_comp.index')
            ->with('success', 'Group created successfully.');
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
        // Validate the request
        $validated = $request->validate([
            'section_adviser_id' => 'required|exists:tbl_section_advisers,id',
            'members' => 'required|array|min:2|max:4',
            'members.*.studentNumber' => 'required|string',
            'members.*.isLeader' => 'required|boolean',
        ]);

        // Verify exactly one leader exists
        $leaderCount = collect($validated['members'])->where('isLeader', true)->count();
        if ($leaderCount !== 1) {
            return back()->withErrors(['members' => 'Exactly one member must be designated as leader.']);
        }

        // Verify the group exists
        $group = DB::table('tbl_thesis_groups')->where('id', $id)->first();
        if (!$group) {
            return back()->withErrors(['group' => 'Group not found.']);
        }

        // Update the group's section_adviser_id if changed
        if ($group->section_adviser_id !== (int) $validated['section_adviser_id']) {
            DB::table('tbl_thesis_groups')
                ->where('id', $id)
                ->update(['section_adviser_id' => $validated['section_adviser_id']]);
        }

        // Get current members of this group
        $currentMembers = DB::table('tbl_students')
            ->where('group_id', $id)
            ->pluck('id')
            ->toArray();

        // Get new member student IDs
        $newMemberIds = [];
        foreach ($validated['members'] as $member) {
            $student = DB::table('tbl_students as s')
                ->join('users as u', 's.user_id', '=', 'u.id')
                ->where('u.identity_no', $member['studentNumber'])
                ->select('s.id')
                ->first();

            if ($student) {
                $newMemberIds[] = $student->id;
            }
        }

        // Unassign members who are no longer in the group
        $membersToRemove = array_diff($currentMembers, $newMemberIds);
        if (!empty($membersToRemove)) {
            DB::table('tbl_students')
                ->whereIn('id', $membersToRemove)
                ->update([
                    'group_id' => null,
                    'is_leader' => false,
                    'updated_at' => now(),
                ]);
        }

        // Assign/update members in the group
        foreach ($validated['members'] as $member) {
            $student = DB::table('tbl_students as s')
                ->join('users as u', 's.user_id', '=', 'u.id')
                ->where('u.identity_no', $member['studentNumber'])
                ->select('s.id')
                ->first();

            if ($student) {
                DB::table('tbl_students')
                    ->where('id', $student->id)
                    ->update([
                        'group_id' => $id,
                        'is_leader' => $member['isLeader'],
                        'updated_at' => now(),
                    ]);
            }
        }

        return redirect()->route('faculty.adviser.group_comp.index')
            ->with('success', 'Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Verify the group exists
        $group = DB::table('tbl_thesis_groups')->where('id', $id)->first();
        if (!$group) {
            return back()->withErrors(['group' => 'Group not found.']);
        }

        // Check if the group has any proposals (with thesis chain)
        $hasProposals = DB::table('tbl_proposals')
            ->where('group_id', $id)
            ->whereNull('deleted_at')
            ->exists();

        // Unassign all students from this group (set group_id to NULL)
        DB::table('tbl_students')
            ->where('group_id', $id)
            ->update([
                'group_id' => null,
                'is_leader' => false,
                'updated_at' => now(),
            ]);

        // Only delete the thesis group if it has no proposals
        // This preserves the proposal -> thesis -> endorsement -> defense_matrix chain
        if (!$hasProposals) {
            DB::table('tbl_thesis_groups')->where('id', $id)->delete();
        }

        return redirect()->route('faculty.adviser.group_comp.index')
            ->with('success', 'Group removed successfully.');
    }
}