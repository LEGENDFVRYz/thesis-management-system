<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GradingCriteria extends Model
{
    use SoftDeletes;

    protected $table = 'tbl_grading_criterias';

    protected static function boot()
    {
        parent::boot();

        // When a Criteria is soft-deleted, soft-delete its Rubrics
        static::deleting(function ($criteria) {
            $criteria->rubrics()->delete();
        });
    }

    
    public function rubrics()
    {
        return $this->hasMany(GradingRubric::class, 'criteria_id');
    }
}
