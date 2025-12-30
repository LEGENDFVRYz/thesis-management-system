<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resource extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_resources';

    protected $fillable = [
        'title',
        'description',
        'file_path',
        'file_type',
        'file_size',
        // 'uploaded_by',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
