<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDefaultRoles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('roles')->insert([
            'id' => 1,
            'name' => 'ADMIN',
            'display_name' => 'Nexteria Admin',
        ]);

        DB::table('roles')->insert([
            'id' => 2,
            'name' => 'STUDENT',
            'display_name' => 'Nexteria Student',
        ]);

        DB::table('roles')->insert([
            'id' => 3,
            'name' => 'LECTOR',
            'display_name' => 'Nexteria Lector',
        ]);

        DB::table('roles')->insert([
            'id' => 4,
            'name' => 'GUIDE',
            'display_name' => 'Nexteria Guide',
        ]);

        DB::table('roles')->insert([
            'id' => 5,
            'name' => 'BUDDY',
            'display_name' => 'Nexteria Buddy',
        ]);

        DB::table('roles')->insert([
            'id' => 6,
            'name' => 'NEXTERIA_TEAM',
            'display_name' => 'Nexteria Team',
        ]);


        # PERMISSIONS
        DB::table('permissions')->insert([
          'id' => 1,
          'name' => 'create_users',
          'display_name' => 'Create users',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 2,
          'name' => 'update_users',
          'display_name' => 'Update users',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 3,
          'name' => 'delete_users',
          'display_name' => 'Delete users',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 4,
          'name' => 'change_users_permissions',
          'display_name' => 'Change users permissions',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 5,
          'name' => 'view_users_notes',
          'display_name' => 'View users notes',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 6,
          'name' => 'create_user_groups',
          'display_name' => 'Create user groups',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 7,
          'name' => 'update_user_groups',
          'display_name' => 'Update user groups',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 8,
          'name' => 'delete_user_groups',
          'display_name' => 'Delete user groups',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 9,
          'name' => 'create_events',
          'display_name' => 'Create events',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 10,
          'name' => 'update_events',
          'display_name' => 'Update events',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 11,
          'name' => 'delete_events',
          'display_name' => 'Delete events',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 12,
          'name' => 'send_events_emails',
          'display_name' => 'Send events emails',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 13,
          'name' => 'create_location',
          'display_name' => 'Create locations',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 14,
          'name' => 'update_location',
          'display_name' => 'Update locations',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 15,
          'name' => 'delete_location',
          'display_name' => 'Delete locations',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 16,
          'name' => 'view_admin_section',
          'display_name' => 'View admin section',
          'description' => 'User will see admin section in app',
        ]);

        DB::table('permissions')->insert([
          'id' => 17,
          'name' => 'create_roles',
          'display_name' => 'Create roles',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 18,
          'name' => 'update_roles',
          'display_name' => 'Update roles',
          'description' => '',
        ]);

        DB::table('permissions')->insert([
          'id' => 19,
          'name' => 'delete_roles',
          'display_name' => 'Delete roles',
          'description' => '',
        ]);


        # ROLE PERMISSIONS
        DB::table('permission_role')->insert([
          'permission_id' => 1,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 2,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 3,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 4,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 5,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 6,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 7,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 8,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 9,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 10,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 11,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 12,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 13,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 14,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 15,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 16,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 17,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 18,
          'role_id' => 1,
        ]);

        DB::table('permission_role')->insert([
          'permission_id' => 19,
          'role_id' => 1,
        ]);


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('roles')->where('name', 'STUDENT')->delete();
        DB::table('roles')->where('name', 'ADMIN')->delete();
        DB::table('roles')->where('name', 'LECTOR')->delete();
        DB::table('roles')->where('name', 'GUIDE')->delete();
        DB::table('roles')->where('name', 'BUDDY')->delete();
        DB::table('roles')->where('name', 'NEXTERIA_TEAM')->delete();
    }
}
