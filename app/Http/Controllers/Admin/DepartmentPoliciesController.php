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
    // ==================================================================
    // System Routes
    // ==================================================================
    /** 
     * Display a listing of the resource.
     */
    public function system()
    {
        return Inertia::render('Admin/management/dept-policies/index', [
            'currentTab' => 'system',
        ]);
    }


    // ==================================================================
    // Workflow Routes
    // ==================================================================
    /** 
     * Display a listing of the resource.
     */
    public function workflow()
    {
        return Inertia::render('Admin/management/dept-policies/index', [
            'currentTab' => 'workflow',
            // 'workflows' => ... (You can pass backend data specific to this tab here)
        ]);
    }



    // ==================================================================
    // Document Requirements Routes
    // ==================================================================
    /** 
     * Display a listing of the resource.
     */
    public function documents()
    {
        return Inertia::render('Admin/management/dept-policies/index', [
            'currentTab' => 'documents',
        ]);
    }



    // ==================================================================
    // Grading Policies Routes
    // ==================================================================
    /** 
     * Display a listing of the resource.
     */
    public function grading()
    {
        $data = GradingCriteria::select('id', 'category', 'weight', 'minimum')->get()->toArray();
        
        return Inertia::render('Admin/management/dept-policies/index', [
            'currentTab' => 'grading',
            'gradeCriteria' => $data,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function storeGrading(Request $request)
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
     * Update the specified resource in storage.
     */
    public function updateGrading(Request $request, string $id)
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
    public function destroyGrading(string $id)
    {
        $criteria = GradingCriteria::findOrFail($id);

        $criteria->delete();
        return redirect()->route('admin.management.dep-policies');
    }


    // ==================================================================
    // Guidelines Routes
    // ==================================================================
    /** 
     * Display a listing of the resource.
     */
    public function guidelines()
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
        
        return Inertia::render('Admin/management/dept-policies/index', [
            'currentTab' => 'guidelines',
            'guidelineUrl' => $guidelineUrl,
        ]);
    }

    /** 
     * Update the specified resource in storage.
     */
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
