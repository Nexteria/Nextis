<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaymentsCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('variableSymbol')->unsigned()->index();
            $table->text('name');
            $table->text('description')->nullable();
            $table->integer('userId')->unsigned();
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->integer('addedBy')->unsigned();
            $table->foreign('addedBy')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->integer('categoryId')->unsigned()->nullable();
            $table->foreign('categoryId')->references('id')->on('payment_categories')->onDelete('cascade');
        });

        $payments = DB::table('payments')
            ->join('students', 'payments.userId', '=', 'students.userId')
            ->select('payments.*', 'tuitionFeeVariableSymbol')
            ->get();

        $categoriesMap = [];
        foreach ($payments as $payment) {
            $categoryId = null;

            if ($payment->variableSymbol == $payment->tuitionFeeVariableSymbol) {
                if (isset($categoriesMap[$payment->userId.'_'.$payment->variableSymbol])) {
                    $categoryId = $categoriesMap[$payment->userId.'_'.$payment->variableSymbol];
                } else {
                    $categoryId = DB::table('payment_categories')->insertGetId([
                        'userId' => $payment->userId,
                        'addedBy' => 1,
                        'name' => 'Školné za NLA',
                        'variableSymbol' => $payment->variableSymbol,
                        'created_at' => \Carbon\Carbon::now(),
                        'updated_at' => \Carbon\Carbon::now(),
                    ]);

                    $categoriesMap[$payment->userId.'_'.$payment->variableSymbol] = $categoryId;
                }
            }

            // camp payments
            if (
                $payment->variableSymbol == '201514'.$payment->userId ||
                $payment->variableSymbol == '201614'.$payment->userId ||
                $payment->variableSymbol == '201714'.$payment->userId ||
                $payment->variableSymbol == '201814'.$payment->userId
            ) {
                if (isset($categoriesMap[$payment->userId.'_'.$payment->variableSymbol])) {
                    $categoryId = $categoriesMap[$payment->userId.'_'.$payment->variableSymbol];
                } else {
                    $categoryId = DB::table('payment_categories')->insertGetId([
                        'userId' => $payment->userId,
                        'addedBy' => 1,
                        'name' => 'Platba za letný leadership camp',
                        'variableSymbol' => $payment->variableSymbol,
                        'created_at' => \Carbon\Carbon::now(),
                        'updated_at' => \Carbon\Carbon::now(),
                    ]);

                    $categoriesMap[$payment->userId.'_'.$payment->variableSymbol] = $categoryId;
                }
            }

            DB::table('payments')->where('id', $payment->id)->update([
                'categoryId' => $categoryId,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign('payments_categoryId_foreign');
            $table->dropColumn('categoryId');
        });

        Schema::drop('payment_categories');
    }
}
