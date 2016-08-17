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
            $table->increments('id');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('username')->unique();
            $table->string('phone')->unique();
            $table->string('email')->unique();
            $table->string('facebookLink');
            $table->string('linkedinLink');
            $table->string('actualJobInfo');
            $table->string('school');
            $table->string('faculty');
            $table->string('studyProgram');
            $table->string('state');
            $table->dateTime('dateOfBirth')->nullable();
            $table->text('personalDescription');
            $table->text('buddyDescription');
            $table->text('guideDescription');
            $table->text('lectorDescription');
            $table->integer('variableSymbol')->unsigned()->nullable()->unique();
            $table->string('iban')->nullable();
            $table->integer('profilePictureId')->unsigned()->nullable();
            $table->integer('studentLevelId')->unsigned()->nullable();
            $table->string('nexteriaTeamRole');
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
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
