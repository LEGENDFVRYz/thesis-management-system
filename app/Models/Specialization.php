<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialization extends Model
{
    protected $fillable = ['spec_name'];

    public function students()
    {
        return $this->hasMany(Student::class, 'spec_id');
    }
}
