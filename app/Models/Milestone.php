<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    protected $table = 'tbl_milestones';

    public $timestamps = false;

    protected $fillable = [
        'stage',
        'name',
        'desc',
    ];
}
