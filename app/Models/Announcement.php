<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $table = 'tbl_announcements';
    public $timestamps = false;

    protected $fillable = [
        'semester_id',
        // 'title',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
