<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Carbon\Carbon;
use App\User;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\InviteUser::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $month = Carbon::now()->month;
            $year = Carbon::now()->year;
            foreach (User::all() as $user) {
                if ($user->state == \Config::get('constants.states.ACTIVE')) {
                    $user->generateMonthlySchoolFee($month, $year, 1);
                }
            }
        })->monthlyOn(env('GENERATE_MONTHLY_SCHOOL_FEE_DAY_IN_MONTH'),
            env('GENERATE_MONTHLY_SCHOOL_FEE_HOUR'));
    }
}
