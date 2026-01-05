<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Carbon\Traits\Timestamp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Resource::all()->toArray();
        // dd(Resource::all()->toArray());
        
        return Inertia::render('Shared/resources', [
            'resources' => $data
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
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,png,jpg,jpeg',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $filename = pathinfo($originalName, PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();

        // simple randomizer of filename for security
        $randomFileName = Str::random(16) . '_' . Str::random(16);

        // upload to public storage
        $file->storeAs('resources', $randomFileName . '.' . $extension, 'public');

        // Overwrite record if the filename is exist
        Resource::updateOrCreate(
            ['file_name' => $filename],
            [
                'file_type'   => strtoupper($extension),
                'file_path'   => $randomFileName, 
                'file_size'   => round($file->getSize() / 1024 / 1024, 2),
                'uploaded_by' => auth()->user()->name,
                'is_active'   => true,
                'uploaded_at' => now(),
            ]
        );

        return back()->with('success', "{$filename} uploaded successfully!");
    }


    public function download(string $filename)
    {
        $resource = Resource::where('file_path', $filename)->firstOrFail();
        $filename = $resource->file_path;
        $file_ext = strtolower($resource->file_type);
        $fullPath = storage_path('app/public/resources/' . $filename . '.' . $file_ext);

        // dd($fullPath);
        abort_if(!file_exists($fullPath), 404);

        return response()->download(
            $fullPath,
            $resource->file_name . '.' . strtolower($resource->file_type),
            [
                'Content-Type' => mime_content_type($fullPath),
            ]
        );
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


    public function toggle(Resource $resource)
    {
        // toggle active status
        $resource->update([
            'is_active' => !$resource->is_active,
        ]);

        return back()->with('success', `{$resource->file_name} successfully set to {$resource->is_active}.`);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource)
    {
        // Softdelete the record
        $resource->delete();
        return back()->with('success', `{$resource->file_name} successfully deleted.`);
    }
}
