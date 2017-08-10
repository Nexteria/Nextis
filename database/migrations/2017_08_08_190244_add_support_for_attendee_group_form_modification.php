<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSupportForAttendeeGroupFormModification extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attendee_group_question', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('questionId')->index();
            $table->foreign('questionId')->references('id')->on('questions')->onDelete('cascade');
            $table->integer('attendeeGroupId')->unsigned();
            $table->foreign('attendeeGroupId')->references('id')->on('attendees_groups')->onDelete('cascade');
        });

        Schema::create('form_descriptions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('formId')->index();
            $table->foreign('formId')->references('id')->on('forms')->onDelete('cascade');
            $table->longText('description');
            $table->integer('attendeeGroupId')->unsigned();
            $table->foreign('attendeeGroupId')->references('id')->on('attendees_groups')->onDelete('cascade');
            $table->integer('userId')->unsigned();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('attendee_group_question');
        Schema::drop('form_descriptions');
    }
}
