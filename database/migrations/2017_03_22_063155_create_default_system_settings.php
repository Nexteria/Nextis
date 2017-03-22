<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\DefaultSystemSettings;

class CreateDefaultSystemSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('default_system_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->string('codename');
            $table->integer('value');
            $table->timestamps();
        });

        DefaultSystemSettings::create([
          'codename' => 'feedbackEmailDelay',
          'value' => '2',
        ])->save();

        DefaultSystemSettings::create([
          'codename' => 'feedbackDaysToFill',
          'value' => '7',
        ])->save();

        DefaultSystemSettings::create([
          'codename' => 'feedbackRemainderDaysBefore',
          'value' => '1',
        ])->save();

        Schema::table('nx_events', function (Blueprint $table) {
            $table->date('emailFeedbackLinkAt')->nullable();
            $table->date('feedbackDeadlineAt')->nullable();
            $table->date('feedbackRemainderAt')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('default_system_settings');

        Schema::table('nx_events', function (Blueprint $table) {
            $table->dropColumn('emailFeedbackLinkAt');
            $table->dropColumn('feedbackDeadlineAt');
            $table->dropColumn('feedbackRemainderAt');
        });
    }
}
