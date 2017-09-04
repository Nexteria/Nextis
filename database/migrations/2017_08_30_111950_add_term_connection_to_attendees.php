<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTermConnectionToAttendees extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nx_event_attendees_nx_event_terms', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('termId')->unsigned()->index();
            $table->foreign('termId')->references('id')->on('nx_event_terms')->onDelete('cascade');
            $table->integer('attendeeId')->unsigned()->index();
            $table->foreign('attendeeId')->references('id')->on('nx_event_attendees')->onDelete('cascade');
            $table->dateTime('signedIn')->nullable();
            $table->dateTime('standIn')->nullable();
            $table->dateTime('signedOut')->nullable();
            $table->dateTime('wontGo')->nullable();
            $table->boolean('wasPresent')->nullable();
            $table->boolean('filledFeedback')->nullable();
            $table->text('signedOutReason')->nullable();
            $table->unique(['termId', 'attendeeId']);
        });

        $attendees = DB::table('nx_event_attendees')->get();
        foreach ($attendees as $attendee) {
            $group = DB::table('attendees_groups')->where('id', $attendee->attendeesGroupId)->first();
            $term = DB::table('nx_event_terms')->where('eventId', $group->eventId)->first();
            DB::table('nx_event_attendees_nx_event_terms')
                ->insert([
                    'termId' => $term->id,
                    'attendeeId' => $attendee->id,
                    'signedIn' => $attendee->signedIn,
                    'signedOut' => $attendee->signedOut,
                    'standIn' => $attendee->standIn,
                    'wontGo' => $attendee->wontGo,
                    'signedOutReason' => $attendee->signedOutReason,
                    'wasPresent' => $attendee->wasPresent,
                    'filledFeedback' => $attendee->filledFeedback,
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
        $attendees = DB::table('nx_event_attendees')->get();
        foreach ($attendees as $attendee) {
            $term = DB::table('nx_event_attendees_nx_event_terms')
                        ->where('attendeeId', $attendee->id)
                        ->first();

            if ($term) {
                DB::table('nx_event_attendees')
                    ->where('id', $attendee->id)
                    ->update([
                        'signedIn' => $term->signedIn,
                        'signedOut' => $term->signedOut,
                        'wontGo' => $term->wontGo,
                        'standIn' => $term->standIn,
                        'signedOutReason' => $term->signedOutReason,
                        'wasPresent' => $term->wasPresent,
                        'filledFeedback' => $term->filledFeedback,
                    ]);
            }
        }

        Schema::drop('nx_event_attendees_nx_event_terms');
    }
}
