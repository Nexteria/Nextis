<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAttendanceColumnsToAttendee extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nx_event_attendees', function (Blueprint $table) {
            $table->boolean('wasPresent')->nullable();
            $table->boolean('filledFeedback')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('nx_event_attendees', function (Blueprint $table) {
            $table->dropColumn('wasPresent');
            $table->dropColumn('filledFeedback');
        });
    }
}
