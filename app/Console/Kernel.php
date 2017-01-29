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

            $activeStudents = Role::where('name', 'STUDENT')
                                  ->first()
                                  ->users()
                                  ->where('state', \Config::get('constants.states.ACTIVE'))
                                  ->get();

            foreach ($activeStudents as $user) {
                $user->generateMonthlySchoolFee($month, $year, 1);
            }
        })->monthlyOn(
            env('GENERATE_MONTHLY_SCHOOL_FEE_DAY_IN_MONTH'),
            env('GENERATE_MONTHLY_SCHOOL_FEE_HOUR')
        );
    }
}
