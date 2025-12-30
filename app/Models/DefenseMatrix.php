<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DefenseMatrix extends Model
{
    use HasFactory;

    protected $table = 'tbl_defense_matrices';

    protected $fillable = [
        'endorsement_id',          
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

    public function endorsement()
    {
        return $this->belongsTo(Endorsement::class, 'endorsement_id');
    }

    /**
     * Link to the Endorsed Panels (The invitations sent for this defense)
    */
    public function endorsedPanels()
    {
        // One Defense Schedule has MANY Panel Invitations
        return $this->hasMany(EndorsedPanel::class, 'defense_matrix_id');
    }

    /**
     * Helper: Access the Thesis "through" the Endorsement
     * Usage: $matrix->thesis->title
     */
    public function getThesisAttribute()
    {
        return $this->endorsement->thesis;
    }
}
