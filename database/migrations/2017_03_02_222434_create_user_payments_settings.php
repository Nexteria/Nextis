<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserPaymentsSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_payments_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('userId')->unsigned()->index();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->integer('schoolFeePaymentsDeadlineDay');
            $table->integer('checkingSchoolFeePaymentsDay');
            $table->integer('generationSchoolFeeDay');
            $table->boolean('disableEmailNotifications');
            $table->boolean('disableSchoolFeePayments');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('user_payments_settings');
    }
}
