<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Endorsement extends Model
{
    use HasFactory;

    protected $table = 'tbl_endorsements';

    protected $fillable = [
        'thesis_id',
        'is_adviser_approved',
        'is_coordinator_approved',
    ];

    protected $casts = [
        'is_adviser_approved'     => 'boolean',
        'is_coordinator_approved' => 'boolean',
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
