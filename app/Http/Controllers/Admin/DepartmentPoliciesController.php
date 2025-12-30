<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GradingCriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

    public function index2()
    {
        $files = Storage::disk('public')->files();
        $policyPath = null;

        foreach ($files as $file) {
            if (Str::startsWith($file, 'CPE_Guidelines_') && Str::endsWith($file, '.pdf')) {
                $policyPath = $file;
                break; // Stop after finding the first match
            }
        }

        // Generate URL if file exists, otherwise null
        $guidelineUrl = null;

        if ($policyPath) {
            $url = asset('storage/' . $policyPath);     // base url
            
            // Get the "Last Modified" ts for version param
            $lastModified = Storage::disk('public')->lastModified($policyPath);
            $guidelineUrl = $url . '?v=' . $lastModified;
        }
        
        return Inertia::render('Admin/management/dep-policies_guidelines', [
            'guidelineUrl' => $guidelineUrl,
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


    // GUIDELINES CONTROLS
    public function updateGuidelines(Request $request)
    {
        $request->validate([
            'pdf_file' => 'required|file|mimes:pdf|max:5120', // 5MB Max
        ]);

        if ($request->hasFile('pdf_file')) {
            // CLEANUP: Delete any OLD policy files
            $files = Storage::disk('public')->files();
            foreach ($files as $file) {
                if (Str::startsWith($file, 'CPE_Guidelines_') && Str::endsWith($file, '.pdf')) {
                    Storage::disk('public')->delete($file);
                }
            }

            // REPLACE: Renamed to base + prefix YYYYMMDD (current date)
            $filename = 'CPE_Guidelines_' . now()->format('Ymd') . '.pdf';

            // STORE: Save the new file
            $request->file('pdf_file')->storeAs('/', $filename, 'public');
        }

        return redirect()->back()->with('success', 'Guidelines updated successfully.');
    }
}
