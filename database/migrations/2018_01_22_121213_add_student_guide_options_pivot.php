<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStudentGuideOptionsPivot extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_guide_options', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('priority');
            $table->longText('whyIWouldChooseThisGuide');
            $table->longText('howCanIHelp');
            $table->integer('studentId')->unsigned()->nullable();
            $table->foreign('studentId')->references('id')->on('students')->onDelete('cascade');
            $table->integer('semesterId')->unsigned()->nullable();
            $table->foreign('semesterId')->references('id')->on('semesters')->onDelete('cascade');
            $table->integer('guideId')->unsigned();
            $table->foreign('guideId')->references('id')->on('guides')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('semester_student', function (Blueprint $table) {
            $table->integer('guideId')->unsigned()->nullable()->after('studentLevelId');
            $table->foreign('guideId')->references('id')->on('guides')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('student_guide_options');

        Schema::table('semester_student', function (Blueprint $table) {
            $table->dropForeign('semester_student_guideid_foreign');
            $table->dropColumn('guideId');
        });
    }
}
