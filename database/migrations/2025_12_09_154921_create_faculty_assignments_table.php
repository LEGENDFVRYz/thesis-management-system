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
        Schema::create('faculty_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('faculty_id')
                  ->constrained('faculties')
                  ->onDelete('cascade');

            $table->foreignId('role_id')
                  ->constrained('faculty_roles')
                  ->onDelete('cascade');

            $table->string('school_year')
                  ->comment("This is the batch that a role can access -> starting year");
            
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_assignments');
    }
};
