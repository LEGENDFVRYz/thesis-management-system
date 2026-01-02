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
            
            // File info
            $table->string('file_name'); // e.g., Project Plan.pdf
            $table->string('file_type'); // e.g., PDF, Image, Excel
            $table->string('file_path'); // Path in /storage/app/public/resources or public URL
            $table->decimal('file_size', 10, 2); // Size in MB

            // Uploader info
            $table->string('uploaded_by'); 
            $table->timestamp('uploaded_at')->useCurrent();
            
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
