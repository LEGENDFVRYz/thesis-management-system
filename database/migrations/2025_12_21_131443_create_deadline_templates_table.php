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
            $table->integer('stage');               // 1=MOR, 2=DP1, 3=DP2
            $table->integer('sort_order');          // Step number (e.g., 1, 2, 3...)
            $table->string('role');

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type');
            $table->integer('days')->nullable();    // Default duration
            $table->integer('anchor')->nullable();  // Code for dependency calculation
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
