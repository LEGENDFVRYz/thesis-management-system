<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacultyAssignment extends Model
{
    /** @use HasFactory<\Database\Factories\FacultyAssignmentFactory> */
    use HasFactory;

    protected $table = 'tbl_faculty_assignments';

    protected $fillable = [
        'faculty_id',
        'role_id',
        'school_year',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(FacultyRole::class, 'role_id');
    }
}
