<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacultyRole extends Model
{
    protected $table = 'tbl_faculty_roles';

    protected $fillable = [
        'role_name',
        'description',
    ];
    
}
