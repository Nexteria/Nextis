<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use Carbon\Carbon;

class ChangeWasPresentAndFilledFeedbackToDatetime extends Migration
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
            $table->renameColumn('wasPresent', 'wasPresentTmp');
            $table->renameColumn('filledFeedback', 'filledFeedbackTmp');
        });

        Schema::table('nx_event_attendees', function (Blueprint $table) {
            $table->dateTime('wasPresent')->nullable()->default(null)->index();
            $table->dateTime('filledFeedback')->nullable()->default(null)->index();
        });

        // transform old values to the new one (boolean -> datetime)
        $attendees = DB::table('nx_event_attendees')
                    ->where('filledFeedbackTmp', 1)
                    ->orWhere('wasPresentTmp', 1)
                    ->get();
        
        foreach ($attendees as $attendee) {
            $group = DB::table('attendees_groups')->where('id', $attendee->attendeesGroupId)->first();
            $event = DB::table('nx_events')->where('id', $group->eventId)->first();

            $parentEventExists = DB::table('nx_grouped_events')->where('nx_event_id', $event->id)->first();
            $eventId = $event->id;
            if ($parentEventExists) {
                $eventId = $parentEventExists->nx_event_parent_id;
            }

            $lastTerm = DB::table('nx_event_terms')->where('eventId', $eventId)
                ->orderBy('eventEndDateTime', 'desc')->first();
            
            $date = new Carbon($event->created_at);
            if ($lastTerm) {
                $date = new Carbon($lastTerm->eventEndDateTime);
            }

            if ($attendee->wasPresentTmp === 1) {
                DB::table('nx_event_attendees')->where('id', $attendee->id)->update([
                    'wasPresent' => $date,
                ]);
            }

            if ($attendee->filledFeedbackTmp === 1) {
                DB::table('nx_event_attendees')->where('id', $attendee->id)->update([
                    'filledFeedback' => $date->addDays(2),
                ]);
            }
        }

        // drop tmp columns
        Schema::table('nx_event_attendees', function (Blueprint $table) {
            $table->dropColumn('wasPresentTmp');
            $table->dropColumn('filledFeedbackTmp');
        });



        Schema::table('nx_event_attendees_nx_event_terms', function (Blueprint $table) {
            $table->renameColumn('wasPresent', 'wasPresentTmp');
            $table->renameColumn('filledFeedback', 'filledFeedbackTmp');
        });

        Schema::table('nx_event_attendees_nx_event_terms', function (Blueprint $table) {
            $table->dateTime('wasPresent')->nullable()->default(null);
            $table->dateTime('filledFeedback')->nullable()->default(null);
        });

        // transform old values to the new one (boolean -> datetime)
        $attendees = DB::table('nx_event_attendees_nx_event_terms')
                    ->where('filledFeedbackTmp', 1)
                    ->orWhere('wasPresentTmp', 1)
                    ->get();
        
        foreach ($attendees as $attendee) {
            $term = DB::table('nx_event_terms')->where('id', $attendee->termId)->first();

            if ($attendee->wasPresentTmp === 1) {
                DB::table('nx_event_attendees_nx_event_terms')->where('id', $attendee->id)->update([
                    'wasPresent' => $term->eventEndDateTime,
                ]);
            }

            if ($attendee->filledFeedbackTmp === 1) {
                DB::table('nx_event_attendees_nx_event_terms')->where('id', $attendee->id)->update([
                    'filledFeedback' => (new Carbon($term->eventEndDateTime))->addDays(2),
                ]);
            }
        }

        // drop tmp columns
        Schema::table('nx_event_attendees_nx_event_terms', function (Blueprint $table) {
            $table->dropColumn('wasPresentTmp');
            $table->dropColumn('filledFeedbackTmp');
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
            $table->boolean('wasPresent')->change();
            $table->boolean('filledFeedback')->change();
        });

        Schema::table('nx_event_attendees_nx_event_terms', function (Blueprint $table) {
            $table->boolean('wasPresent')->change();
            $table->boolean('filledFeedback')->change();
        });
    }
}
