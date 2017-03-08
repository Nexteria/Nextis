<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Carbon\Carbon;
use App\User;
use App\Role;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\InviteUser::class,
        Commands\AutogenerateTuitionFeeDebet::class,
        Commands\AutogenerateTuitionPaymentNotification::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('autogenerate:tuitionFeeDebet')->dailyAt('1:00');
        $schedule->command('autogenerate:tuitionPaymentNotification')->dailyAt('1:00');
    }
}
