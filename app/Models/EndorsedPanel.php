<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EndorsedPanel extends Model
{
    use HasFactory;

    protected $table = 'tbl_endorsed_panels';
    public $timestamps = false;

    protected $fillable = [
        'defense_matrix_id',
        'panel_id',
        'is_confirmed',
    ];

    protected $casts = [
        'is_confirmed' => 'boolean',
    ];

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */

    public function defenseMatrix()
    {
        return $this->belongsTo(DefenseMatrix::class, 'defense_matrix_id');
    }

    public function facultyAssignment()
    {
        return $this->belongsTo(FacultyAssignment::class, 'panel_id');
    }
}
