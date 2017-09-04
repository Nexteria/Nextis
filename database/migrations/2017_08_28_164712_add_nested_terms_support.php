<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNestedTermsSupport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('nx_event_terms', function (Blueprint $table) {
            $table->integer('parentTermId')->unsigned()->nullable()->index();
            $table->foreign('parentTermId')->references('id')->on('nx_event_terms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('nx_event_terms', function (Blueprint $table) {
            $table->dropForeign('nx_event_terms_parenttermid_foreign');
            $table->dropColumn('parentTermId');
        });
    }
}
