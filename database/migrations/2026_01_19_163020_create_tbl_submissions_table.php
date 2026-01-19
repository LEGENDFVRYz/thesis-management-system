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
            $table->unsignedBigInteger('event_id');

            // Query Helpers
            $table->tinyInteger('stage')->comment('1=MOR, 2=DP1, 3=DP2'); 
            // $table->unsignedBigInteger('semester_id')->after('stage');

            // Fields matching the "Upload Document" Modal
            $table->string('title');                    // Input: "Document Title"
            $table->string('document_type')->nullable();// Select: "Type" (e.g., 'Report', 'Source Code')
            $table->text('description')->nullable();    // Textarea: "Document Description"
            $table->string('file_path');                // Upload: Stores the path of the uploaded file

            $table->text('comments')->nullable();
            
            // Status Tracking
            $table->tinyInteger('status')->default(0);  // 0=Pending, 1=Review, 2=Approved, 3=Rejected
            $table->timestamp('submitted_at')->useCurrent();

            // Constraints
            $table->unique(['group_id', 'event_id', 'title']);

            $table->foreign('group_id')
                ->references('id')
                ->on('tbl_thesis_groups')
                ->onDelete('cascade');

            $table->foreign('event_id')
                ->references('id')
                ->on('tbl_events')
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
