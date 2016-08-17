<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNxEventAttendeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nx_event_attendees', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('signedIn')->nullable();
            $table->dateTime('signedOut')->nullable();
            $table->dateTime('wontGo')->nullable();
            $table->text('signedOutReason')->nullable();
            $table->integer('attendeesGroupId')->unsigned();
            $table->integer('userId')->unsigned();
            $table->integer('ownerId')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('userId')->references('id')->on('users');
            $table->foreign('ownerId')->references('id')->on('users');
            $table->foreign('attendeesGroupId')->references('id')->on('attendees_groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('attendees_group_user');
    }
}
