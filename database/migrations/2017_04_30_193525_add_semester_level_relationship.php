<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSemesterLevelRelationship extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('semester_student_level', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('tuitionFee')->unsigned();
            $table->integer('activityPointsBaseNumber')->unsigned();
            $table->integer('minimumSemesterActivityPoints')->unsigned();
            $table->integer('semesterId')->unsigned()->index();
            $table->foreign('semesterId')->references('id')->on('semesters')->onDelete('cascade');
            $table->integer('studentLevelId')->unsigned()->index();
            $table->foreign('studentLevelId')->references('id')->on('student_levels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('semester_student_level');
    }
}
