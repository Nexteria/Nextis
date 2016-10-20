<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExclusionaryEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nx_exclusionary_events', function (Blueprint $table) {
            $table->integer('nx_event_parent_id')->unsigned()->index();
            $table->foreign('nx_event_parent_id')->references('id')->on('nx_events')->onDelete('cascade');
            $table->integer('nx_event_id')->unsigned()->index();
            $table->foreign('nx_event_id')->references('id')->on('nx_events')->onDelete('cascade');
            $table->primary(['nx_event_parent_id', 'nx_event_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('nx_exclusionary_events');
    }
}
