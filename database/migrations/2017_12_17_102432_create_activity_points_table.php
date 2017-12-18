<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateActivityPointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activity_points', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('gainedPoints')->unsigned();
            $table->integer('maxPossiblePoints')->unsigned();
            $table->integer('studentId')->unsigned()->index();
            $table->foreign('studentId')->references('id')->on('students')->onDelete('cascade');
            $table->integer('semesterId')->unsigned()->index();
            $table->foreign('semesterId')->references('id')->on('semesters')->onDelete('cascade');
            $table->text('activityName');
            $table->string('activityType');
            $table->integer('activityModelId')->unsigned()->nullable()->index();
            $table->text('note')->nullable();
            $table->integer('addedByUserId')->unsigned()->nullable();
            $table->foreign('addedByUserId')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        $semesterIds = DB::table('semesters')->pluck('id');
        $students = DB::table('students')->get();

        foreach ($semesterIds as $semesterId) {
            $events = DB::table('nx_events')->where('semesterId', $semesterId)->get();
            $eventIds = $events->pluck('id');
            $attendeesGroups = DB::table('attendees_groups')->whereIn('eventId', $eventIds)->whereNull('deleted_at')->get();
            $attendeesGroupIds = $attendeesGroups->pluck('id');
            foreach ($students as $student) {
                $attendees = DB::table('nx_event_attendees')
                    ->whereIn('attendeesGroupId', $attendeesGroupIds)
                    ->where('userId', $student->userId)
                    ->whereNull('deleted_at')
                    ->get();
                
                foreach ($attendees as $attendee) {
                    if ($attendee->wasPresent && $attendee->filledFeedback) {
                        $group = $attendeesGroups->where('id', $attendee->attendeesGroupId)->first();
                        $event = $events->where('id', $group->eventId)->first();

                        $parentEventExists = DB::table('nx_grouped_events')->where('nx_event_id', $event->id)->exists();
                        if ($event->status !== 'published' || $parentEventExists) {
                            continue;
                        }

                        DB::table('activity_points')
                            ->insert([
                                'gainedPoints' => $event->activityPoints,
                                'maxPossiblePoints' => $event->activityPoints,
                                'studentId' => $student->id,
                                'semesterId' => $semesterId,
                                'activityName' => $event->name,
                                'activityType' => 'event',
                                'activityModelId' => $group->eventId,
                                'created_at' => $attendee->updated_at,
                                'updated_at' => $attendee->updated_at,
                            ]);
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('activity_points');
    }
}
