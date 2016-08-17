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
            $table->string('facebookLink')->nullable();
            $table->string('linkedinLink')->nullable();
            $table->string('actualJobInfo')->nullable();
            $table->string('school')->nullable();
            $table->string('faculty')->nullable();
            $table->string('studyProgram')->nullable();
            $table->string('state')->nullable();
            $table->dateTime('dateOfBirth')->nullable();
            $table->text('personalDescription')->nullable();
            $table->text('buddyDescription')->nullable();
            $table->text('guideDescription')->nullable();
            $table->text('lectorDescription')->nullable();
            $table->integer('variableSymbol')->unsigned()->nullable()->unique();
            $table->string('iban')->nullable();
            $table->integer('profilePictureId')->unsigned()->nullable();
            $table->integer('studentLevelId')->unsigned()->nullable();
            $table->string('nexteriaTeamRole')->nullable();
            $table->string('password')->nullable();
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
