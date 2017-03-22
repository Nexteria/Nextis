<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSemesterTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('semesters', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->date('startDate');
            $table->date('endDate');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('nx_event_semester', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('nx_event_id')->unsigned()->index();
            $table->foreign('nx_event_id')->references('id')->on('nx_events')->onDelete('cascade');
            $table->integer('semester_id')->unsigned()->index();
            $table->foreign('semester_id')->references('id')->on('semesters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('semesters');
        Schema::drop('nx_event_semester');
    }
}
