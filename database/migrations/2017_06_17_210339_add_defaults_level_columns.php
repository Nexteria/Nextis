<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDefaultsLevelColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_levels', function (Blueprint $table) {
            $table->integer('defaultTuitionFee')->unsigned();
            $table->integer('defaultActivityPointsBaseNumber')->unsigned();
            $table->integer('defaultMinimumSemesterActivityPoints')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('nx_events', function (Blueprint $table) {
            $table->dropColumn('defaultTuitionFee');
            $table->dropColumn('defaultActivityPointsBaseNumber');
            $table->dropColumn('defaultMinimumSemesterActivityPoints');
        });
    }
}
