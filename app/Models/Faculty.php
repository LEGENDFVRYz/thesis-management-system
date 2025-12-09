<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name_prefix',
        'last_name',
        'first_name',
        'middle_name',
        'is_regular',
    ];

    protected $casts = [
        'is_regular' => 'boolean',
    ];


    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
