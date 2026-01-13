<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $table = 'tbl_announcements';

    protected $fillable = [
        'semester_id',
        'subject',
        'priority_level',
        'message',
        'target_audience',
    ];

    /**
     * Get the semester that owns the announcement.
     */
    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
