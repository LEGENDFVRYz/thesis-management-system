<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $table = 'tbl_submissions';

    /**
     * Since the table uses submitted_at instead of created_at/updated_at
     */
    public $timestamps = false;

    /**
     * Mass assignable attributes
     * Updated to match the Upload Document UI
     */
    protected $fillable = [
        'group_id',
        'event_id',       // CHANGED from milestone_id
        // 'semester_id', // Helper
        'stage',       // Helper (1=MOR, 2=DP1, 3=DP2)
        'title',
        'document_type',
        'description',
        'file_path',
        'comments',       // For teacher feedback
        'status',         // To track approval
        'submitted_at',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'submitted_at' => 'datetime',
        'status' => 'integer',
    ];

    /**
     * Relationships
     */
    public function group()
    {
        return $this->belongsTo(ThesisGroup::class, 'group_id');
    }

    public function milestone()
    {
        return $this->belongsTo(Milestone::class, 'milestone_id');
    }
}