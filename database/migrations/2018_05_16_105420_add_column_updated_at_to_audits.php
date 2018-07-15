<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnUpdatedAtToAudits extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $connection = config('audit.drivers.database.connection');
        $tableName = config('audit.drivers.database.table');
        Schema::connection($connection)
            ->table($tableName, function (Blueprint $table) use ($connection, $tableName) {
                if (!Schema::connection($connection)->hasColumn($tableName, 'updated_at')) {
                    $table->timestamp('updated_at');
                }
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection(config('audit.drivers.database.connection'))
            ->table(config('audit.drivers.database.table'), function (Blueprint $table) {
                $table->dropColumn('updated_at');
            });
    }
}
