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
        Schema::create('tbl_submissions', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('milestone_id');

            // Fields matching the "Upload Document" Modal
            $table->string('title');                    // Input: "Document Title"
            $table->string('document_type')->nullable();// Select: "Type" (e.g., 'Report', 'Source Code')
            $table->text('description')->nullable();    // Textarea: "Document Description"
            $table->string('file_path');                // Upload: Stores the path of the uploaded file

            $table->text('comments')->nullable();

            // Status Tracking
            $table->timestamp('submitted_at')->useCurrent();

            // Constraints
            $table->unique(['group_id', 'milestone_id']);

            $table->foreign('group_id')
                ->references('id')
                ->on('tbl_thesis_groups')
                ->onDelete('cascade');

            $table->foreign('milestone_id')
                ->references('id')
                ->on('tbl_milestones')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_submissions');
    }
};
