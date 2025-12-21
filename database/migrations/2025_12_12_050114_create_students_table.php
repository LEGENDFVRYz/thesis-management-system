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
        Schema::create('tbl_students', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key to Users
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade')
                  ->comment('Link to their main account credentials');

            // Foreign Key to Groups
            $table->foreignId('group_id')
                  ->nullable()
                  ->constrained('tbl_thesis_groups')
                  ->nullOnDelete();
            
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->string('section');
            
            // Foreign Key to Specializations
            $table->foreignId('spec_id')
                  ->constrained('tbl_specializations')
                  ->comment("Student's Specialization / Major");

            $table->boolean('is_leader')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_students');
    }
};
