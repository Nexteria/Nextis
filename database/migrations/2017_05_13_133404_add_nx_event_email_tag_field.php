<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AddNxEventEmailTagField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nx_events', function (Blueprint $table) {
            $table->string('emailTagBase')->nullable()->unique();
        });

        $events = DB::table('nx_events')->get();
        foreach ($events as $event) {
            $year = Carbon::parse($event->eventStartDateTime)->format('Y');
            $emailTagBase = Str::ascii($event->name).'-'.$year;

            try {
                DB::table('nx_events')->where('id', $event->id)->update([
                  'emailTagBase' => $emailTagBase,
                ]);
            } catch (\Exception $e) {
                DB::table('nx_events')->where('id', $event->id)->update([
                  'emailTagBase' => \Uuid::generate(4),
                ]);
            }
        }


        Schema::table('nx_events', function (Blueprint $table) {
            $table->string('emailTagBase')->nullable(false)->change();
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
            $table->dropColumn('emailTagBase');
        });
    }
}
