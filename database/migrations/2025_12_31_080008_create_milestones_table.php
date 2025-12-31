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
        Schema::create('tbl_milestones', function (Blueprint $table) {
            $table->id();

            $table->integer('stage')->comment('1=MOR, 2=DP1, 3=DP2');   // Thesis stages
            $table->integer('sort_order');              // Step number within the whole process

            $table->string('name');             // Milestone name
            $table->text('desc')->nullable();   // General display description

            // --- TABLE CONSTRAINTS ---
            $table->unique(['stage', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_milestones');
    }
};
