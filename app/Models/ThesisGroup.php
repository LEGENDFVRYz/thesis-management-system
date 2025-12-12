<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThesisGroup extends Model
{
    use HasFactory;

    protected $table = 'tbl_thesis_groups';

    protected $fillable = [
        'section_adviser_id',
        'group_number',
    ];

    public $timestamps = false;

    /*
    ==================================================================================
    RELATIONSHIPS
    ==================================================================================
    */
    public function adviser()
    {
        return $this->belongsTo(SectionAdviser::class, 'section_adviser_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'group_id');
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class, 'group_id');
    }

    /**
     * Link to the Section Adviser (tbl_section_advisers)
     */
    public function sectionAdviser()
    {
        // 2nd argument 'section_adviser_id' is REQUIRED because you aren't using the default 'section_adviser_id' convention
        return $this->belongsTo(SectionAdviser::class, 'section_adviser_id');
    }
}
