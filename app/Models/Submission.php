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
        'milestone_id',
        'title',          // From "Document Title"
        'document_type',  // From "Type"
        'description',    // From "Document Description"
        'file_path',      // Path to the uploaded file
        'submitted_at',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'submitted_at' => 'datetime',
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