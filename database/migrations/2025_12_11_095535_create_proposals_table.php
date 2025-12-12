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
        Schema::create('tbl_proposals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('group_id')
                  ->constrained('tbl_thesis_groups')
                  ->cascadeOnDelete();

            // Derived (Review this later)
            $table->integer('group_code')->nullable();

            $table->text('proposal_title');

            $table->text('proposal_filepath');

            $table->boolean('is_pursued')->default(false);

            // Derived (Review this later)
            $table->string('proposal_status')->nullable();

            $table->timestamps();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_proposals');
    }
};
