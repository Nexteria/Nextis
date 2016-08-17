<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNxLocations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nx_locations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('instructions')->nullable();
            $table->text('description');
            $table->integer('ownerId')->unsigned();
            $table->string('latitude');
            $table->string('longitude');
            $table->string('addressLine1');
            $table->string('addressLine2');
            $table->string('city');
            $table->string('zipCode');
            $table->string('countryCode');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ownerId')->references('id')->on('users');
        });

        Schema::table('nx_events', function (Blueprint $table) {
            $table->foreign('nxLocationId')->references('id')->on('nx_locations');
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
            $table->dropForeign('nx_events_nxlocationid_foreign');
        });

        Schema::drop('nx_locations');
    }
}
