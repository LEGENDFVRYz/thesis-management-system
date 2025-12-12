<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Theses extends Model
{
    use HasFactory;

    protected $table = 'tbl_theses';

    protected $fillable = [
        'proposal_id',         
        'title',               
        'manuscript_filepath',
    ];

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */

    public function proposal()
    {
        return $this->belongsTo(Proposal::class, 'proposal_id');
    }

    /**
     * Helper to get the group easily: $thesis->group
     */
    public function getGroupAttribute()
    {
        return $this->proposal->group;
    }
}
