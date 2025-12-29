<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_semesters', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('school_year_id')
                  ->constrained('tbl_school_years')
                  ->onDelete('cascade');

            $table->tinyInteger('semester'); // 0 = 1st Sem, 1 = 2nd Sem
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_semesters');
    }
};
