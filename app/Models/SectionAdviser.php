<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SectionAdviser extends Model
{
    use HasFactory;

    protected $table = 'tbl_section_advisers';

    protected $fillable = [
        'section',
        'faculty_assign_id',
    ];

    public $timestamps = false;

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    
    public function assignment()
    {
        return $this->belongsTo(FacultyAssignment::class, 'faculty_assign_id');
    }

    public function groups()
    {
        return $this->hasMany(ThesisGroup::class, 'section_adviser_id');
    }
}
