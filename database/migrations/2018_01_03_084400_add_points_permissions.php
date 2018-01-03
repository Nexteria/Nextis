<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPointsPermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('permissions')->insert([
          'name' => 'delete_activity_points',
          'display_name' => 'Delete activity points',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'name' => 'add_activity_points',
          'display_name' => 'Add activity points',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'name' => 'change_activity_points',
          'display_name' => 'Change activity points',
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
        DB::table('permissions')->where('name', 'delete_activity_points')->delete();
        DB::table('permissions')->where('name', 'add_activity_points')->delete();
        DB::table('permissions')->where('name', 'change_activity_points')->delete();
    }
}
