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
        Schema::create('tbl_resources', function (Blueprint $table) {
            $table->id();
            
            $table->string('title');
            $table->text('description')->nullable();
            
            $table->text('file_path');
            $table->string('file_type');
            $table->decimal('file_size', 10, 2);
            
            // Stores the name of the uploader directly (as a snapshot)
            // rather than a foreign key, ensuring the name remains even if the user is deleted.
            // Derived
            // $table->string('uploaded_by'); 
            
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_resources');
    }
};
