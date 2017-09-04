<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTermsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nx_event_terms', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('eventId')->unsigned()->index();
            $table->foreign('eventId')->references('id')->on('nx_events')->onDelete('cascade');
            $table->integer('userId')->unsigned()->index();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->integer('minCapacity')->unsigned();
            $table->integer('maxCapacity')->unsigned();
            $table->integer('hostId')->unsigned()->nullable()->index();
            $table->foreign('hostId')->references('id')->on('users')->onDelete('cascade');
            $table->dateTime('eventStartDateTime');
            $table->dateTime('eventEndDateTime');
            $table->text('feedbackLink')->nullable();
            $table->text('publicFeedbackLink')->nullable();
            $table->integer('nxLocationId')->unsigned();
            $table->foreign('nxLocationId')->references('id')->on('nx_locations')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        $events = DB::table('nx_events')->get();
        foreach ($events as $event) {
            DB::table('nx_event_terms')->insert([
                'eventId' => $event->id,
                'userId' => $event->ownerId,
                'minCapacity' => $event->minCapacity,
                'maxCapacity' => $event->maxCapacity,
                'eventStartDateTime' => $event->eventStartDateTime,
                'eventEndDateTime' => $event->eventEndDateTime,
                'feedbackLink' => $event->feedbackLink,
                'publicFeedbackLink' => $event->publicFeedbackLink,
                'hostId' => $event->hostId,
                'nxLocationId' => $event->nxLocationId,
                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at,
            ]);
        }

        Schema::table('nx_events', function (Blueprint $table) {
            $table->dropColumn('minCapacity');
            $table->dropColumn('maxCapacity');
            $table->dropColumn('eventStartDateTime');
            $table->dropColumn('eventEndDateTime');
            $table->dropColumn('feedbackLink');
            $table->dropColumn('publicFeedbackLink');
            $table->dropForeign('nx_events_nxlocationid_foreign');
            $table->dropColumn('nxLocationId');
            $table->dropForeign('nx_events_hostid_foreign');
            $table->dropColumn('hostId');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('nx_events', function (Blueprint $table) {
            $table->integer('minCapacity')->unsigned()->nullable();
            $table->integer('maxCapacity')->unsigned()->nullable();
            $table->integer('hostId')->unsigned()->nullable()->index();
            $table->dateTime('eventStartDateTime')->nullable();
            $table->dateTime('eventEndDateTime')->nullable();
            $table->text('feedbackLink')->nullable();
            $table->text('publicFeedbackLink')->nullable();
            $table->integer('nxLocationId')->unsigned()->nullable();
        });

        $terms = DB::table('nx_event_terms')->orderBy('created_at', 'desc')->get();
        foreach ($terms as $term) {
            DB::table('nx_events')
                ->where('id', $term->eventId)
                ->update([
                    'minCapacity' => $term->minCapacity,
                    'maxCapacity' => $term->maxCapacity,
                    'eventStartDateTime' => $term->eventStartDateTime,
                    'eventEndDateTime' => $term->eventEndDateTime,
                    'hostId' => $term->hostId,
                    'feedbackLink' => $term->feedbackLink,
                    'publicFeedbackLink' => $term->publicFeedbackLink,
                    'nxLocationId' => $term->nxLocationId,
                ]);
        }

        Schema::table('nx_events', function (Blueprint $table) {
            $table->integer('minCapacity')->unsigned()->nullable(false)->change();
            $table->integer('maxCapacity')->unsigned()->nullable(false)->change();
            $table->dateTime('eventStartDateTime')->nullable(false)->change();
            $table->dateTime('eventEndDateTime')->nullable(false)->change();
            $table->integer('nxLocationId')->unsigned()->nullable(false)->change();

            $table->foreign('nxLocationId')->references('id')->on('nx_locations')->onDelete('cascade');
            $table->foreign('hostId')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('nx_event_terms', function (Blueprint $table) {
            $table->dropForeign('nx_event_terms_nxlocationid_foreign');
            $table->dropForeign('nx_event_terms_userid_foreign');
            $table->dropForeign('nx_event_terms_hostid_foreign');
        });

        Schema::drop('nx_event_terms');
    }
}
