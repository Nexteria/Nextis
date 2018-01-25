<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeGuideOptionsColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_guide_options', function (Blueprint $table) {
            $table->dropColumn('howCanIHelp');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_guide_options', function (Blueprint $table) {
            $table->longText('howCanIHelp')->after('whyIWouldChooseThisGuide');
        });
    }
}
