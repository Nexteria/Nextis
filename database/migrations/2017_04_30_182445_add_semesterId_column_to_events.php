<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSemesterIdColumnToEvents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nx_events', function (Blueprint $table) {
            $table->integer('semesterId')->unsigned()->nullable();
            $table->foreign('semesterId')->references('id')->on('semesters');
        });

        $eventsSemesterRows = DB::table('nx_event_semester')->get();
        
        foreach ($eventsSemesterRows as $row) {
            DB::table('nx_events')->where('id', $row->nx_event_id)
                                  ->update(['semesterId' => $row->semester_id]);
        }

        Schema::drop('nx_event_semester');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('nx_event_semester', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('nx_event_id')->unsigned()->index();
            $table->foreign('nx_event_id')->references('id')->on('nx_events')->onDelete('cascade');
            $table->integer('semester_id')->unsigned()->index();
            $table->foreign('semester_id')->references('id')->on('semesters')->onDelete('cascade');
        });

        $eventsRows = DB::table('nx_events')->whereNotNull('semesterId')->get();
        
        foreach ($eventsRows as $row) {
            DB::table('nx_event_semester')->insert([
              'semester_id' => $row->semesterId,
              'nx_event_id' => $row->id,
            ]);
        }

        Schema::table('nx_events', function (Blueprint $table) {
            $table->dropForeign('nx_events_semesterid_foreign');
            $table->dropColumn('semesterId');
        });
    }
}
