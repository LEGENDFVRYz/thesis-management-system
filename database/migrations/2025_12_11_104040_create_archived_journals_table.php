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
        Schema::create('tbl_archived_journals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('thesis_id')
                  ->constrained('tbl_theses')
                  ->cascadeOnDelete();

            $table->text('file_path');

            $table->decimal('file_size', 10, 2);

            $table->text('keywords')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archived_journals');
    }
};
