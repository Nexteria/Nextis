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
        Commands\AutogenerateFeedbackFormNotification::class,
        Commands\AutogenerateFeedbackFormRemainder::class,
        Commands\AutogenerateFeedbackStatsMail::class,
        Commands\AutogenerateHostAttendanceMail::class,
        Commands\AutogenerateEventManagerAttendanceCheckMail::class,
        Commands\AutogenerateEventNotEnoughPeopleMail::class,
        Commands\AutogenerateEventReminderMail::class,
        Commands\AutogenerateEventSignInOpeningMail::class,
        Commands\AutogenerateHostNotificationMail::class,
        Commands\AutogenerateEventSignInRemainderMail::class,
        Commands\AutogenerateOpeningNoticeToEventManagerMail::class,
        Commands\GetGoogleUserRefreshToken::class,
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

        $schedule->command('autogenerate:openingNoticeToEventManagerMail')->dailyAt('1:00');
        $schedule->command('autogenerate:hostNotificationMail')->dailyAt('1:00');
        $schedule->command('autogenerate:eventSignInOpeningMail')->everyMinute();
        $schedule->command('autogenerate:eventSignInRemainderMail')->dailyAt('1:00');
        $schedule->command('autogenerate:eventNotEnoughPeopleMail')->dailyAt('1:00');
        $schedule->command('autogenerate:eventReminderMail')->dailyAt('1:00');
        $schedule->command('autogenerate:eventManagerAttendanceCheckMail')->everyMinute();
        $schedule->command('autogenerate:hostAttendanceMail')->everyMinute();
        $schedule->command('autogenerate:feedbackFormNotification')->dailyAt('1:00');
        $schedule->command('autogenerate:feedbackFormRemainder')->dailyAt('1:00');
        $schedule->command('autogenerate:feedbackStatsMail')->dailyAt('1:00');
    }
}
