<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use Carbon\Carbon;

class AddFeedbackDateTimesForTerms extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nx_event_terms', function (Blueprint $table) {
            $table->dateTime('feedbackOpenAt')->nullable()->default(null)->index();
            $table->dateTime('feedbackDeadlineAt')->nullable()->default(null)->index();
            $table->dateTime('feedbackWasSentAt')->nullable()->default(null);
            $table->dateTime('attendanceWasWrittenAt')->nullable()->default(null);
        });

        $terms = DB::table('nx_event_terms')
            ->whereNotNull('publicFeedbackLink')
            ->where('publicFeedbackLink', '!=', '')
            ->get();

        foreach ($terms as $term) {
            $termEndDate = new Carbon($term->eventEndDateTime);
            $feedbackSendTime = (new Carbon($term->eventEndDateTime))->addDays(1);
            $feedbackSendTime->hour = 10;
            $feedbackDeadlineTime = (new Carbon($term->eventEndDateTime))->addDays(8);
            $feedbackDeadlineTime->hour = 23;
            $attendanceWriteTime = (new Carbon($term->eventEndDateTime))->addHours(3);

            DB::table('nx_event_terms')->where('id', $term->id)->update([
                'feedbackOpenAt' => $feedbackSendTime,
                'feedbackWasSentAt' => $termEndDate->isPast() ? $feedbackSendTime : null,
                'feedbackDeadlineAt' => $feedbackDeadlineTime,
                'attendanceWasWrittenAt' => $termEndDate->isPast() ? $attendanceWriteTime : null,
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
        Schema::table('nx_event_terms', function (Blueprint $table) {
            $table->dropColumn('feedbackOpenAt');
            $table->dropColumn('feedbackDeadlineAt');
            $table->dropColumn('feedbackWasSentAt');
            $table->dropColumn('attendanceWasWrittenAt');
        });
    }
}
