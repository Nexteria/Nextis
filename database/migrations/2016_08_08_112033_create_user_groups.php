<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserGroups extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_groups', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->integer('ownerId')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ownerId')->references('id')->on('users');
        });

        Schema::table('student_levels', function (Blueprint $table) {
            $table->foreign('user_group_id')->references('id')->on('user_groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_levels', function (Blueprint $table) {
            $table->dropForeign('student_levels_user_group_id_foreign');
        });
        
        Schema::drop('user_groups');
    }
}
