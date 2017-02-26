<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMandatoryParticipationColumToEvents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nx_events', function (Blueprint $table) {
            $table->boolean('mandatoryParticipation')->default(false);
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
            $table->dropColumn('mandatoryParticipation');
        });
    }
}
