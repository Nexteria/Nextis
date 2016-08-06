<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('uuid');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('phone')->unique();
            $table->string('email')->unique();
            $table->string('facebookLink');
            $table->string('linkedIn');
            $table->string('actualJob');
            $table->string('school');
            $table->string('faculty');
            $table->string('studyProgram');
            $table->string('state');
            $table->text('personalDescription');
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}
