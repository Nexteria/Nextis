<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNxEventsSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nx_events_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('eventId')->unsigned()->index();
            $table->foreign('eventId')->references('id')->on('nx_events')->onDelete('cascade');
            $table->integer('feedbackEmailDelay');
            $table->integer('feedbackDaysToFill');
            $table->integer('feedbackRemainderDaysBefore');
            $table->integer('hostInstructionEmailDaysBefore');
            $table->integer('eventSignInOpeningManagerNotificationDaysBefore');
            $table->integer('eventSignInRemainderDaysBefore');
            $table->timestamps();
        });

        Schema::table('nx_events', function (Blueprint $table) {
            $table->text('publicFeedbackLink')->nullable();
            $table->dropColumn('emailFeedbackLinkAt');
            $table->dropColumn('feedbackDeadlineAt');
            $table->dropColumn('feedbackRemainderAt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('nx_events_settings');

        Schema::table('nx_events', function (Blueprint $table) {
            $table->date('emailFeedbackLinkAt')->nullable();
            $table->date('feedbackDeadlineAt')->nullable();
            $table->date('feedbackRemainderAt')->nullable();
            $table->dropColumn('publicFeedbackLink');
        });
    }
}
