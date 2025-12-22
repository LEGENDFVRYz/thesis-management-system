<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolYear extends Model
{
    use HasFactory;

    protected $table = 'tbl_school_years';

    public $timestamps = false;

    protected $fillable = [
        'year',
        'start_date',
        'end_date',
        'archived_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'archived_at'=> 'date',
    ];

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */

    public function semesters()
    {
        return $this->hasMany(Semester::class, 'school_year_id');
    }
}
