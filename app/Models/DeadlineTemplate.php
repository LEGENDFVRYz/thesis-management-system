<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeadlineTemplate extends Model
{
    use HasFactory;

    protected $table = 'tbl_deadline_templates';
    public $timestamps = false;

    protected $fillable = [
        'stage',
        'name',
        'description',
        'duration',
        'anchor',
    ];
}
