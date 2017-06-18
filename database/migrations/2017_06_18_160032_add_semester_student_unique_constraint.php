<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSemesterStudentUniqueConstraint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('semester_student', function (Blueprint $table) {
            $table->unique(['semesterId', 'studentId']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('semester_student', function (Blueprint $table) {
            $table->dropUnique('semester_student_semesterid_studentid_unique');
        });
    }
}
