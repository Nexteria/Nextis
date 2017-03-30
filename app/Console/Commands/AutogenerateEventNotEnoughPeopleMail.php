<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

class AutogenerateEventNotEnoughPeopleMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:eventNotEnoughPeopleMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends warning to manager about low count of signed in people';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $today = Carbon::now()->format('Y-m-d');

        foreach (NxEvent::where('status', 'published')->get() as $event) {
            $settings = $event->getSettings();

            $isSignInClosed = true;
            $lastSignInCloseDate = Carbon::now()->subYears(10);
            $actualSignInCount = 0;
            foreach ($event->attendeesGroups as $group) {
                $actualSignInCount = $group->attendees()->where('signedIn', '>', '')->count();
                if ($group->signUpDeadlineDateTime->format('Y-m-d') > $today) {
                    $isSignInClosed = false;
                }

                if ($group->signUpDeadlineDateTime->format('Y-m-d') > $lastSignInCloseDate->format('Y-m-d')) {
                    $lastSignInCloseDate = $group->signUpDeadlineDateTime;
                }
            }

            $isTimeForNotification = $lastSignInCloseDate->addDays(1)->format('Y-m-d') == $today;
            $isLowSigninCount = $event->minCapacity > $actualSignInCount;
            if ($isSignInClosed && $isTimeForNotification && $isLowSigninCount) {
                $settings = $event->getSettings();
                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);
                $email = new \App\Mail\Events\EventNotEnoughPeopleMail($event, $actualSignInCount, $manager);
                \Mail::send($email);
            }
        }
    }
}
