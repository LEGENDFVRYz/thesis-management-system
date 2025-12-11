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
        Schema::create('theses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('proposal_id')
                  ->constrained('proposals')
                  ->cascadeOnDelete();

            $table->foreignId('group_id')
                  ->constrained('thesis_groups')
                  ->cascadeOnDelete();

            // Derived (Review this later)
            $table->integer('group_code')->nullable();

            $table->string('title');

            $table->text('manuscript_filepath')->nullable();

            // Derived (Review this later)
            $table->string('thesis_status')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theses');
    }
};
