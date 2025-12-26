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
        Schema::create('tbl_availability', function (Blueprint $table) {
            $table->id();
            
            // Link to the Faculty Member
            $table->foreignId('faculty_id')
                  ->constrained('tbl_faculties')
                  ->onDelete('cascade');

            // Link to the specific Defense Event (from tbl_events)
            // Your ERD calls this 'defense_week_id'
            $table->foreignId('defense_week_id')
                  ->constrained('tbl_events')
                  ->onDelete('cascade');

            $table->dateTime('start_date');
            $table->dateTime('end_date');
            
            $table->softDeletes(); // Creates 'deleted_at'
            // $table->timestamps();  // Creates 'created_at' and 'updated_at'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_availability');
    }
};
