<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentModelTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('userId')->unsigned()->index();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->string('firstName');
            $table->string('lastName');
            $table->integer('tuitionFeeVariableSymbol')->unsigned()->unique();
            $table->integer('studentLevelId')->unsigned()->index();
            $table->foreign('studentLevelId')->references('id')->on('student_levels')->onDelete('cascade');
            $table->string('status')->default('inactive');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('semester_student', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('studentId')->unsigned()->index();
            $table->foreign('studentId')->references('id')->on('students')->onDelete('cascade');
            $table->integer('semesterId')->unsigned()->index();
            $table->foreign('semesterId')->references('id')->on('semesters')->onDelete('cascade');
            $table->integer('studentLevelId')->unsigned()->index();
            $table->foreign('studentLevelId')->references('id')->on('student_levels')->onDelete('cascade');
            $table->integer('tuitionFee')->unsigned();
            $table->integer('activityPointsBaseNumber')->unsigned();
            $table->integer('minimumSemesterActivityPoints')->unsigned();
        });

        $usersRows = DB::table('users')->whereNotNull('studentLevelId')->get();
        foreach ($usersRows as $user) {
            $studentId = DB::table('students')->insertGetId([
              'userId' => $user->id,
              'studentLevelId' => $user->studentLevelId,
              'tuitionFeeVariableSymbol' => $user->tuitionFeeVariableSymbol,
              'firstName' => $user->firstName,
              'lastName' => $user->lastName,
              'status' => $user->state,
            ]);

            DB::table('semester_student')->insert([
                'studentId' => $studentId,
                'semesterId' => DB::table('default_system_settings')->where('codename', 'activeSemesterId')
                                                                    ->first()
                                                                    ->value,
                'tuitionFee' => $user->monthlySchoolFee,
                'activityPointsBaseNumber' => $user->activityPointsBaseNumber,
                'minimumSemesterActivityPoints' => $user->minimumSemesterActivityPoints,
                'studentLevelId' => $user->studentLevelId,
            ]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_studentlevelid_foreign');
            $table->dropColumn('tuitionFeeVariableSymbol');
            $table->dropColumn('studentLevelId');
            $table->dropColumn('monthlySchoolFee');
            $table->dropColumn('activityPointsBaseNumber');
            $table->dropColumn('minimumSemesterActivityPoints');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('tuitionFeeVariableSymbol')->unsigned()->nullable()->unique();
            $table->integer('studentLevelId')->unsigned()->nullable()->index();
            $table->foreign('studentLevelId')->references('id')->on('student_levels')->onDelete('cascade');
            $table->integer('monthlySchoolFee')->unsigned();
            $table->integer('activityPointsBaseNumber')->unsigned();
            $table->integer('minimumSemesterActivityPoints')->unsigned();
        });

        $studentsRows = DB::table('students')->get();
        foreach ($studentsRows as $student) {
            $activeSemesterId = DB::table('default_system_settings')->where('codename', 'activeSemesterId')
                                                                    ->first()
                                                                    ->value;
            $semesterRecord = DB::table('semester_student')->where('studentId', $student->id)
                                                           ->where('semesterId', $activeSemesterId)
                                                           ->first();
            DB::table('users')->where('id', $student->userId)->update([
              'studentLevelId' => $student->studentLevelId,
              'tuitionFeeVariableSymbol' => $student->tuitionFeeVariableSymbol,
              'state' => $student->status,
              'monthlySchoolFee' => $semesterRecord ? $semesterRecord->tuitionFee : 0,
              'activityPointsBaseNumber' => $semesterRecord ? $semesterRecord->activityPointsBaseNumber : 0,
              'minimumSemesterActivityPoints' => $semesterRecord ? $semesterRecord->minimumSemesterActivityPoints : 0,
            ]);
        }

        Schema::drop('semester_student');
        Schema::drop('students');
    }
}
