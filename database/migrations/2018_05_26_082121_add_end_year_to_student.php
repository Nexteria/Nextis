<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEndYearToStudent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->integer('endYear')->unsigned()->nullable();
        });

        $students = DB::table('students')->where('studentLevelId', 4)->get();

        foreach ($students as $student) {
            DB::table('students')->where('id', $student->id)->update([
                'endYear' => $student->startingYear + 3,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('endYear');
        });
    }
}
