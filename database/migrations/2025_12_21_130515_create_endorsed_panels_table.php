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
        Schema::create('tbl_endorsed_panels', function (Blueprint $table) {
            $table->id();
            
            // Link to the specific Defense Schedule (Matrix)
            $table->foreignId('defense_matrix_id')
                  ->constrained('tbl_defense_matrices')
                  ->onDelete('cascade');

            // Link to the Faculty Member assigned as a Panelist
            $table->foreignId('panel_id')
                  ->constrained('tbl_faculty_assignments')
                  ->onDelete('cascade');

            // Status of their confirmation
            $table->boolean('is_confirmed')->nullable()->default(null);
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_endorsed_panels');
    }
};
