<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RubricScore extends Model
{
    use HasFactory;

    protected $table = 'tbl_rubric_scores';

    protected $fillable = [
        'evaluation_id',
        'rubric_id',
        'rating',
    ];

    // Relationship to Parent Evaluation
    public function evaluation()
    {
        return $this->belongsTo(DefenseEvaluation::class, 'evaluation_id');
    }

    // Relationship to specific Rubric Definition
    public function rubric()
    {
        return $this->belongsTo(GradingRubric::class, 'rubric_id');
    }
}
