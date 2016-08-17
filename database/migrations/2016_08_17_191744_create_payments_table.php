<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('id');
            $table->text('message')->nullable();
            $table->text('email')->nullable();
            $table->integer('amount')->unsigned();
            $table->string('transactionType');
            $table->string('constantSymbol')->nullable();
            $table->string('variableSymbol')->nullable();
            $table->string('specificSymbol')->nullable();
            $table->string('ownerIban');
            $table->string('payerIban')->nullable();
            $table->text('description')->nullable();
            $table->integer('userId')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('userId')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('payments');
    }
}
