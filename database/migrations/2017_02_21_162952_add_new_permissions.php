<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNewPermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('permissions')->insert([
          'name' => 'delete_payments',
          'display_name' => 'Delete payments',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'name' => 'add_payments',
          'display_name' => 'Add payments',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'name' => 'change_payments_settings',
          'display_name' => 'Change payments (global and users) settings',
          'description' => '',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('permissions')->where('name', 'delete_payments')->delete();
        DB::table('permissions')->where('name', 'add_payments')->delete();
        DB::table('permissions')->where('name', 'change_payments_settings')->delete();
    }
}
