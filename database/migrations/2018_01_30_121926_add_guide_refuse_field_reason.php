<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGuideRefuseFieldReason extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_guide_options', function (Blueprint $table) {
            $table->longText('whyDoYouRefuseThisGuide')->after('whyIWouldChooseThisGuide');
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
            $table->dropColumn('whyDoYouRefuseThisGuide');
        });
    }
}
