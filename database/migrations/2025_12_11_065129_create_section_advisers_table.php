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
        Schema::create('tbl_section_advisers', function (Blueprint $table) {
            $table->id();

            $table->integer('section');
            
            $table->foreignId('faculty_assign_id')
                ->nullable()
                ->constrained('tbl_faculty_assignments')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_advisers_assignments');
    }
};
