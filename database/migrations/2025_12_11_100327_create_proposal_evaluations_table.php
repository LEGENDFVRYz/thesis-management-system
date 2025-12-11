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
        Schema::create('proposal_evaluations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('proposal_id')
                  ->constrained('proposals')
                  ->cascadeOnDelete();

            $table->foreignId('evaluator_id')
                  ->constrained('faculty_assignments')
                  ->cascadeOnDelete();

            $table->text('comment')->nullable();

            $table->boolean('is_approved')->default(false);

            $table->timestamps();

            $table->unique(['proposal_id', 'evaluator_id'], 'unique_proposal_evaluation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposal_evaluations');
    }
};
