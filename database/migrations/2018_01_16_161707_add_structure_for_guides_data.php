<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStructureForGuidesData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('guides', function (Blueprint $table) {
            $table->increments('id');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('email');
            $table->string('linkedInUrl');
            $table->string('currentOccupation');
            $table->integer('userId')->unsigned()->nullable();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->integer('profileImageId')->unsigned()->nullable();
            $table->foreign('profileImageId')->references('id')->on('images')->onDelete('cascade');
            $table->integer('lastModifiedUserId')->unsigned();
            $table->foreign('lastModifiedUserId')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('guide_field_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('codename');
            $table->integer('order')->nullable();
            $table->boolean('required');
            $table->integer('userId')->unsigned();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('guide_fields', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('needUpdates')->nullable();
            $table->integer('fieldTypeId')->unsigned();
            $table->foreign('fieldTypeId')->references('id')->on('guide_field_types')->onDelete('cascade');
            $table->integer('userId')->unsigned();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->integer('guideId')->unsigned();
            $table->foreign('guideId')->references('id')->on('guides')->onDelete('cascade');
            $table->longText('value');
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
        Schema::drop('guide_fields');
        Schema::drop('guide_field_types');
        Schema::drop('guides');
    }
}
