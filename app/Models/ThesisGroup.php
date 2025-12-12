<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThesisGroup extends Model
{
    protected $table = 'tbl_thesis_groups';

    protected $fillable = [
        'adviser_id',
        'group_section',
        'group_number',
    ];

    public $timestamps = false;

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    public function adviser()
    {
        return $this->belongsTo(FacultyAssignment::class, 'adviser_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'group_id');
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class, 'group_id');
    }
}
