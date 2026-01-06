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
        Schema::create('tbl_rubric_scores', function (Blueprint $table) {
            $table->id();
            
            // Link to the main evaluation header (Who graded whom)
            $table->unsignedBigInteger('evaluation_id');
            $table->foreign('evaluation_id')
                  ->references('id')
                  ->on('tbl_defense_evaluations')
                  ->onDelete('cascade');

            // Link to the specific rubric item being graded (What criteria?)
            $table->unsignedBigInteger('rubric_id');
            $table->foreign('rubric_id')
                  ->references('id')
                  ->on('tbl_grading_rubrics')
                  ->onDelete('cascade');

            // The actual score given (e.g., 1-4)
            $table->integer('rating');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_rubric_scores');
    }
};
