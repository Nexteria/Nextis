<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFeedbackTimestampsToAttendees extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nx_event_attendees_nx_event_terms', function (Blueprint $table) {
            $table->dateTime('feedbackOpenAt')->nullable()->default(null)->index();
            $table->dateTime('feedbackDeadlineAt')->nullable()->default(null)->index();
            $table->dateTime('feedbackWasSentAt')->nullable()->default(null);
        });

        $attendees = DB::table('nx_event_attendees_nx_event_terms')->get();

        foreach ($attendees as $attendee) {
            $term = DB::table('nx_event_terms')->where('id', $attendee->termId)->first();

            DB::table('nx_event_attendees_nx_event_terms')->where('id', $attendee->id)->update([
                'feedbackOpenAt' => $term->feedbackOpenAt,
                'feedbackWasSentAt' => $term->feedbackWasSentAt,
                'feedbackDeadlineAt' => $term->feedbackDeadlineAt,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('nx_event_attendees_nx_event_terms', function (Blueprint $table) {
            $table->dropColumn('feedbackOpenAt');
            $table->dropColumn('feedbackDeadlineAt');
            $table->dropColumn('feedbackWasSentAt');
        });
    }
}
