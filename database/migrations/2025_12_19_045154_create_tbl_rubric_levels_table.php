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
        Schema::create('tbl_rubric_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rubrics_id')
                  ->constrained('tbl_grading_rubrics')
                  ->onDelete('cascade');
                  
            $table->integer('performance_indicator');
            $table->text('description');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_rubric_levels');
    }
};
