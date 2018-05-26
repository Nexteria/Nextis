<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameSkolneToClenske extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $categories = DB::table('payment_categories')
            ->where('name', 'Školné za NLA')
            ->get();

        foreach ($categories as $category) {
            DB::table('payment_categories')->where('id', $category->id)->update([
                'name' => 'Členské za NLA',
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
        $categories = DB::table('payment_categories')
            ->where('name', 'Členské za NLA')
            ->get();

        foreach ($categories as $category) {
            DB::table('payment_categories')->where('id', $category->id)->update([
                'name' => 'Školné za NLA',
            ]);
        }
    }
}
