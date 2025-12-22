<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Availability extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_availability';
    public $timestamps = false;

    protected $fillable = [
        'faculty_id',
        'defense_week_id',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date'   => 'datetime',
    ];

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }

    /**
     * Relates to the specific Event (e.g., "MOR Defense")
     */
    public function defenseEvent()
    {
        return $this->belongsTo(Event::class, 'defense_week_id');
    }
}
