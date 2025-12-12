<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    protected $table = 'tbl_proposals';

    protected $fillable = [
        'group_id',
        'group_code',
        'proposal_title',
        'proposal_filepath',
        'is_pursued',
        'proposal_status',
    ];

    protected $casts = [
        'is_pursued' => 'boolean',
        'group_code' => 'integer',
    ];


    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    public function group()
    {
        return $this->belongsTo(ThesisGroup::class, 'group_id');
    }
}
