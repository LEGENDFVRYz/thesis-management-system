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
        Schema::create('tbl_events', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('dl_template_id')
                  ->constrained('tbl_deadline_templates')
                  ->onDelete('cascade');
            
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
        Schema::dropIfExists('tbl_events');
    }
};
