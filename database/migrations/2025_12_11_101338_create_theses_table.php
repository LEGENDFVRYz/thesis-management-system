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
        Schema::create('tbl_theses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('proposal_id')
                  ->constrained('tbl_proposals')
                  ->cascadeOnDelete();

            // Derived (Review this later)
            // $table->foreignId('group_id')
            //       ->constrained('tbl_thesis_groups')
            //       ->cascadeOnDelete();

            $table->string('title');

            $table->text('manuscript_filepath')->nullable();

            // Derived (Review this later)
            // $table->string('thesis_status')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_theses');
    }
};
