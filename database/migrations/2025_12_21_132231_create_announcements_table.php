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
            
            // Foreign Key
            $table->foreignId('semester_id')
                  ->constrained('tbl_semesters')
                  ->cascadeOnDelete();

            // Content Fields
            $table->text('subject');
            $table->string('priority_level'); // e.g., 'Low', 'Normal', 'High', 'Urgent'
            $table->text('message');
            $table->string('target_audience'); // e.g., 'All', 'Student', 'Faculty'

            $table->timestamps();
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
