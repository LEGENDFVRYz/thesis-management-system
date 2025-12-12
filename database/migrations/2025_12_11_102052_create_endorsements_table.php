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
        Schema::create('tbl_endorsements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('thesis_id')
                  ->constrained('tbl_theses')
                  ->cascadeOnDelete();

            $table->boolean('is_adviser_approved')->nullable();

            $table->boolean('is_coordinator_approved')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_endorsements');
    }
};
