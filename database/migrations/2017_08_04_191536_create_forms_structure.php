<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFormsStructure extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');
            $table->integer('userId')->unsigned()->index();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->string('name');
            $table->longText('description');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');
            $table->uuid('formId');
            $table->foreign('formId')->references('id')->on('forms')->onDelete('cascade');
            $table->integer('userId')->unsigned()->index();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->string('question');
            $table->string('type');
            $table->boolean('required');
            $table->integer('order')->unsigned()->nullable();
            $table->integer('minSelection')->unsigned()->nullable();
            $table->integer('maxSelection')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('choices', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');
            $table->uuid('questionId');
            $table->foreign('questionId')->references('id')->on('questions')->onDelete('cascade');
            $table->integer('userId')->unsigned()->index();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->string('title');
            $table->integer('order')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('answers', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');
            $table->uuid('choiceId');
            $table->foreign('choiceId')->references('id')->on('choices')->onDelete('cascade');
            $table->integer('userId')->unsigned()->index();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->longText('answer');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('nx_events', function (Blueprint $table) {
            $table->uuid('signInFormId')->nullable();
            $table->foreign('signInFormId')->references('id')->on('forms')->onDelete('cascade');
        });

        Schema::create('question_dependencies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('questionId')->index();
            $table->foreign('questionId')->references('id')->on('questions')->onDelete('cascade');
            $table->uuid('choiceId')->index();
            $table->foreign('choiceId')->references('id')->on('choices')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('answers');
        Schema::drop('question_dependencies');
        Schema::drop('choices');
        Schema::drop('questions');

        Schema::table('nx_events', function (Blueprint $table) {
            $table->dropForeign('nx_events_signinformid_foreign');
            $table->dropColumn('signInFormId');
        });

        Schema::drop('forms');
    }
}
