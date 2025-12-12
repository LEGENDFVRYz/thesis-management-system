<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProposalEvaluation extends Model
{
    use HasFactory;

    protected $table = 'tbl_proposal_evaluations';

    protected $fillable = [
        'proposal_id',
        'evaluator_id',
        'comment',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
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

    public function evaluator()
    {
        return $this->belongsTo(FacultyAssignment::class, 'evaluator_id');
    }
}
