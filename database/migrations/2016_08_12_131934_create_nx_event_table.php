<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNxEventTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nx_events', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('eventType');
            $table->string('status');
            $table->text('description');
            $table->text('shortDescription');
            $table->integer('activityPoints')->unsigned();
            $table->dateTime('eventStartDateTime');
            $table->dateTime('eventEndDateTime');
            $table->integer('minCapacity')->unsigned();
            $table->integer('maxCapacity')->unsigned();
            $table->integer('hostId')->unsigned();
            $table->integer('nxLocationId')->unsigned();
            $table->integer('ownerId')->unsigned();
            $table->integer('curriculumLevelId')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('hostId')->references('id')->on('users');
            $table->foreign('ownerId')->references('id')->on('users');
            $table->foreign('curriculumLevelId')->references('id')->on('student_levels');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('nx_events');
    }
}
