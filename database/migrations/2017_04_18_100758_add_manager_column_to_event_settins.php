<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddManagerColumnToEventSettins extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nx_events', function (Blueprint $table) {
            $table->integer('eventsManagerUserId')->unsigned()->nullable();
            $table->foreign('eventsManagerUserId')->references('id')->on('users');
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
            $table->dropColumn('eventsManagerUserId');
        });
    }
}
