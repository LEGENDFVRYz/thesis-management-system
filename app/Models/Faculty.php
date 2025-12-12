<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'tbl_faculties';

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
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function roles()
    {
        return $this->belongsToMany(FacultyRole::class, 'faculty_assignments', 'faculty_id', 'role_id');
    }


    /*
    ==================================================================================
    HELPERS
    ==================================================================================
    */
    public function isAdmin(): bool
    {
        return $this->roles()
                    ->where('role_name', 'Admin') // Must match your DB string exactly
                    ->wherePivot('is_active', true) // Only active admins
                    ->exists();
    }
}
