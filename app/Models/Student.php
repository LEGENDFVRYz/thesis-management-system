<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'tbl_students';
    
    protected $fillable = [
        'user_id',
        'group_id',
        'email',
        'last_name',
        'first_name',
        'middle_name',
        'section',
        'spec_id',
        'is_leader',
    ];

    protected $casts = [
        'is_leader' => 'boolean',
    ];
    

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function specialization()
    {
        return $this->belongsTo(Specialization::class, 'spec_id');
    }
}
