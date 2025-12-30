<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DefenseEvaluation extends Model
{
    use HasFactory;

    protected $table = 'tbl_defense_evaluations';

    protected $fillable = [
        'defense_id',
        'evaluator_id',
        'grade',
        'comment',
        'remarks',
    ];

    protected $casts = [
        'grade' => 'decimal:2'
    ];

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */

    public function defense()
    {
        return $this->belongsTo(DefenseMatrix::class, 'defense_id');
    }

    public function evaluator()
    {
        return $this->belongsTo(FacultyAssignment::class, 'evaluator_id');
    }

    public function rubricScores()
    {
        return $this->hasMany(RubricScore::class, 'evaluation_id');
    }
}
