<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\DefaultSystemSettings;

class AddNewEventsDefautSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DefaultSystemSettings::create([
          'codename' => 'hostInstructionEmailDaysBefore',
          'value' => '2',
        ])->save();

        DefaultSystemSettings::create([
          'codename' => 'eventsManagerUserId',
          'value' => '1',
        ])->save();

        DefaultSystemSettings::create([
          'codename' => 'eventSignInOpeningManagerNotificationDaysBefore',
          'value' => '1',
        ])->save();

        DefaultSystemSettings::create([
          'codename' => 'eventSignInRemainderDaysBefore',
          'value' => '1',
        ])->save();

        DefaultSystemSettings::create([
          'codename' => 'sentCopyOfAllEventNotificationsToManager',
          'value' => 1,
        ])->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DefaultSystemSettings::where('codename', '=', 'hostInstructionEmailDaysBefore')->first()->delete();
        DefaultSystemSettings::where('codename', '=', 'eventsManagerUserId')->first()->delete();
        DefaultSystemSettings::where('codename', '=', 'eventSignInOpeningManagerNotificationDaysBefore')->first()->delete();
        DefaultSystemSettings::where('codename', '=', 'eventSignInRemainderDaysBefore')->first()->delete();
    }
}
