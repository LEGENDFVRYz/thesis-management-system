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
        Schema::create('tbl_announcements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('semester_id')
                  ->constrained('tbl_semesters')
                  ->onDelete('cascade');

            // Derived
            // $table->string('title'); // Copied from template for convenience

            $table->date('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_announcements');
    }
};
