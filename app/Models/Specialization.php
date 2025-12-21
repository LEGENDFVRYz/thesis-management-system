<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialization extends Model
{
    protected $table = 'tbl_specializations';
    
    protected $fillable = ['spec_name'];

    public $timestamps = false;

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    public function students()
    {
        return $this->hasMany(Student::class, 'spec_id');
    }
}
