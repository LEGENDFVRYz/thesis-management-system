<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GradingCriteria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentPoliciesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(GradingCriteria::select('id', 'category', 'weight', 'minimum')->get()->toArray());
        $data = GradingCriteria::select('id', 'category', 'weight', 'minimum')->get()->toArray();

        return Inertia::render('Admin/management/dep-policies', [
            'grading' => $data
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
        // Validate request
        $validated = $request->validate([
            'category' => 'required|string|max:120',
            'weight'   => 'required|numeric|min:0|max:100',
            'minimum'  => 'required|numeric|min:0|max:100',
        ]);

        GradingCriteria::create($validated);

        return redirect()->route('admin.management.dep-policies');
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
        // Testing phase, but since we used modal... this route is technically unnecessary
        // Used this if you have specific editing form page
        
        // Fetch the grading criteria by ID
        $criteria = GradingCriteria::find($id);

        if (!$criteria) {
            return response()->json([
                'success' => false,
                'message' => 'Grading criteria not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $criteria
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $criteria = GradingCriteria::findOrFail($id);

        if (!$criteria) {
            return redirect()->back()->with('error', 'Grading criteria not found');
        }

        // Validate request
        $validated = $request->validate([
            'category' => 'required|string|max:120',
            'weight'   => 'required|numeric|min:0|max:100',
            'minimum'  => 'required|numeric|min:0|max:100',
        ]);

        // dd($validated);

        // Update with validated data
        $criteria->update($validated);

        return redirect()->route('admin.management.dep-policies');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $criteria = GradingCriteria::findOrFail($id);

        $criteria->delete();
        return redirect()->route('admin.management.dep-policies');
    }
}
