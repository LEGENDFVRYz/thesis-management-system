<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DefenseMatrix extends Model
{
    use HasFactory;

    protected $table = 'tbl_defense_matrices';

    protected $fillable = [
        'thesis_id',          
        'course',           
        'defense_schedule', 
        'defense_room',
    ];

    protected $casts = [
        'defense_schedule' => 'datetime',
        'defense_room'     => 'integer',
    ];

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */

    public function thesis()
    {
        return $this->belongsTo(Theses::class, 'thesis_id');
    }
}
