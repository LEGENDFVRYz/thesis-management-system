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
        Schema::create('tbl_faculties', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade')
                  ->comment('Link to their main credentials');

            $table->string('name_prefix')->nullable()->comment('Dr., Engr., Prof.');
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            
            $table->boolean('is_regular')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_faculties');
    }
};
