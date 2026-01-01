<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'tbl_events';
    public $timestamps = false;

    protected $fillable = [
        'milestone_id',
        'semester_id',
        'start_date',
        'offset'
    ];

    protected $casts = [
        'due_date' => 'date',
    ];
    
    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */

    // public function deadlineTemplate()
    // {
    //     return $this->belongsTo(DeadlineTemplate::class, 'dl_template_id');
    // }

    public function milestone()
    {
        return $this->belongsTo(Milestone::class, 'milestone_id');
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
