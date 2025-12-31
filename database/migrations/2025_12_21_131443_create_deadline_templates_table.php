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
        Schema::create('tbl_deadline_templates', function (Blueprint $table) {
            $table->id();
            
            // $table->foreignId('id')
            //       ->constrained('tbl_milestones')
            //       ->cascadeOnDelete();

            $table->string('role');

            $table->string('type');
            $table->text('desc')->nullable();        // Role-specific display description
            $table->integer('days')->nullable();     // Default duration
            $table->integer('anchor')->nullable()    // id for dependency calculation
                  ->comment('linked to itself');    
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_deadline_templates');
    }
};
