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
        'dl_template_id',
        'semester_id',
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

    public function deadlineTemplate()
    {
        return $this->belongsTo(DeadlineTemplate::class, 'dl_template_id');
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
