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
        Schema::create('tbl_defense_matrices', function (Blueprint $table) {
            $table->id();

            $table->foreignId('thesis_id')
                  ->constrained('tbl_theses')
                  ->cascadeOnDelete();

            $table->string('title');

            $table->enum('course', ['MOR', 'DP1', 'DP2'])->comment('MOR, DP1, DP2');

            // Derived (Review this later)
            $table->string('academic_year')->nullable();

            $table->dateTime('defense_schedule');

            $table->string('defense_room');

            // Derived (Review this later)
            $table->boolean('is_defended')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_defense_matrices');
    }
};