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
        Schema::create('tbl_defense_evaluations', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('defense_id')
                  ->constrained('tbl_defense_matrices')
                  ->cascadeOnDelete();

            $table->foreignId('evaluator_id')
                  ->constrained('tbl_faculty_assignments')
                  ->cascadeOnDelete();

            $table->decimal('grade', 5, 2);

            $table->text('comment')->nullable();

            $table->string('remarks')->nullable();

            $table->timestamps();

            $table->unique(['defense_id', 'evaluator_id'], 'unique_defense_eval');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('defense_evaluations');
    }
};
