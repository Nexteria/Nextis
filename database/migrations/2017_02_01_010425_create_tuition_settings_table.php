<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTuitionSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tuition_default_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->text('schoolFeeApplicableMonths');
            $table->integer('schoolFeePaymentsDeadlineDay');
            $table->integer('checkingSchoolFeePaymentsDay');
            $table->integer('generationSchoolFeeDay');
            $table->timestamps();
        });

        DB::table('tuition_default_settings')->insert([
          'schoolFeeApplicableMonths' => '0,1,2,3,4,5,8,9,10,11',
          'schoolFeePaymentsDeadlineDay' => 9,
          'checkingSchoolFeePaymentsDay' => 14,
          'generationSchoolFeeDay' => 4,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('tuition_default_settings');
    }
}
