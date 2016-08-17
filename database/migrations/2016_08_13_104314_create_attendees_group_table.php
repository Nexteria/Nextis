<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttendeesGroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attendees_groups', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->dateTime('signUpOpenDateTime');
            $table->dateTime('signUpDeadlineDateTime');
            $table->integer('minCapacity')->unsigned();
            $table->integer('maxCapacity')->unsigned();
            $table->integer('ownerId')->unsigned();
            $table->integer('eventId')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ownerId')->references('id')->on('users');
            $table->foreign('eventId')->references('id')->on('nx_events');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('attendees_groups');
    }
}
