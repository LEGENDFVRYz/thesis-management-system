<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RubricLevel extends Model
{
    use SoftDeletes;
    protected $table = 'tbl_rubric_levels';


    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    public function rubric()
    {
        return $this->belongsTo(GradingRubric::class, 'rubrics_id');
    }
}
