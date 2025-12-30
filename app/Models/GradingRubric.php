<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class GradingRubric extends Model
{
    use SoftDeletes;

    protected $table = 'tbl_grading_rubrics';

    protected static function boot()
    {
        parent::boot();

        // When a Rubric is soft-deleted, soft-delete its corresponding levels
        static::deleting(function ($rubric) {
            $rubric->levels()->delete();
        });
    }

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    public function criteria() 
    {
        return $this->belongsTo(GradingCriteria::class, 'criteria_id');
    }

    public function levels()
    {
        return $this->hasMany(RubricLevel::class, 'rubrics_id');
    }

    public function scores()
    {
        return $this->hasMany(RubricScore::class, 'rubric_id');
    }
}
