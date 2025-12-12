<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArchivedJournal extends Model
{
    use HasFactory;

    protected $table = 'tbl_archived_journals';

    public $timestamps = false;

    protected $fillable = [
        'thesis_id',
        'file_path',
        'file_size', 
        'keywords',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'date',
        'file_size'  => 'decimal:2',
    ];

    public function thesis()
    {
        return $this->belongsTo(Theses::class, 'thesis_id');
    }
}
