<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\FileUploadRequest;
use App\Repositories\Academic\AcademicPeriodRepository;
use App\Repositories\Student\StudentListingRepository;
use App\Services\StudentImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct(
        protected AcademicPeriodRepository $academicPeriods,
        protected StudentListingRepository $studentListing,
        protected StudentImportService $studentImport,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get the year (e.g., 2025) from the active semester
        $activeYear = $this->academicPeriods->activeYearOrDefault();

        $students = $this->studentListing->listWithGroupAndAdviser($activeYear);

        return Inertia::render('Admin/management/student', [
            'students' => $students,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FileUploadRequest $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'mapping' => 'required|json',
            'action' => 'required|in:update,skip',
            'dry_run' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $result = $this->studentImport->importFromCsv(
                file: $request->file('file'),
                mapping: json_decode($request->input('mapping'), true),
                action: $request->input('action'),
                isDryRun: $request->boolean('dry_run'),
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: '.$e->getMessage()], 500);
        }
    }
}
