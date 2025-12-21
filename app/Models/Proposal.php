<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proposal extends Model
{
    use HasFactory, SoftDeletes;    
    
    protected $table = 'tbl_proposals';

    protected $fillable = [
        'group_id',
        'proposal_title',
        'proposal_filepath',
        'is_pursued',
    ];

    protected $casts = [
        'is_pursued' => 'boolean',
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
