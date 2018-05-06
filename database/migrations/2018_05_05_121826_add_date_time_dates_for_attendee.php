<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use Carbon\Carbon;

class AddDateTimeDatesForAttendee extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // rename old columns and create new
        Schema::table('nx_event_attendees', function (Blueprint $table) {
            $table->dateTime('signInOpenDateTime')->nullable()->default(null)->index()->after('standIn');
            $table->dateTime('signInCloseDateTime')->nullable()->default(null)->index()->after('signInOpenDateTime');
        });

        // transform old values to the new one (boolean -> datetime)
        $attendees = DB::table('nx_event_attendees')->get();
        
        foreach ($attendees as $attendee) {
            $group = DB::table('attendees_groups')->where('id', $attendee->attendeesGroupId)->first();

            DB::table('nx_event_attendees')->where('id', $attendee->id)->update([
                'signInOpenDateTime' => $group->signUpOpenDateTime,
                'signInCloseDateTime' => $group->signUpDeadlineDateTime,
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
        Schema::table('nx_event_attendees', function (Blueprint $table) {
            $table->dropColumn('signInOpenDateTime');
            $table->dropColumn('signInCloseDateTime');
        });
    }
}
