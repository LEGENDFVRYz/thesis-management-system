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
        Schema::create('tbl_thesis_groups', function (Blueprint $table) {
            $table->id();

            $table->foreignId('section_adviser_id')
                  ->constrained('tbl_section_advisers')
                  ->cascadeOnDelete();

            $table->integer('group_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_thesis_groups');
    }
};
