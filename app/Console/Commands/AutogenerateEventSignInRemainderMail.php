<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

class AutogenerateEventSignInRemainderMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:eventSignInRemainderMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends remainder about event signin';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $today = Carbon::now()->format('Y-m-d');

        foreach (NxEvent::where('status', 'published')->get() as $event) {
            if ($event->getParentEvent()) {
                continue;
            }

            $settings = $event->getSettings();
            
            $manager = \App\User::findOrFail($settings['eventsManagerUserId']);

            $isRemainderTime = false;
            $eventSignInDeadline = '';
            $isEventMaxOut = $event->attendees()->whereNotNull('signedIn')->count() >= $event->maxCapacity;
            foreach ($event->attendeesGroups as $group) {
                $notificationTime = $group->signUpDeadlineDateTime->subDays($settings['eventSignInRemainderDaysBefore'])->format('Y-m-d');
                $isGroupMaxOut = $group->attendees()->whereNotNull('signedIn')->count() >= $group->maxCapacity;
                if ($notificationTime === $today && !$isEventMaxOut && !$isGroupMaxOut) {
                    $eventSignInDeadline = $group->signUpDeadlineDateTime->format('j.n.Y H:i');

                    $attendees = $group->attendees()->whereNull('signedIn')->whereNull('wontGo')->whereNull('signedOut')->get();
                    foreach ($attendees as $attendee) {
                        // ak sa nemoze prihlasit ktokolvek zo skupiny, nemoze sa cela skupina
                        if ($event->canSignInAttendee($attendee)['canSignIn'] !== true) {
                            break;
                        }

                        $email = new \App\Mail\Events\EventSignInRemainderMail($event, $attendee->user, $attendee->signInToken, $eventSignInDeadline, $manager);
                        \Mail::send($email);
                    }
                    $isRemainderTime = true;
                }
            }

            $sendCopyToManager = boolval($settings['sentCopyOfAllEventNotificationsToManager']);
            if ($sendCopyToManager && $isRemainderTime) {
                $email = new \App\Mail\Events\EventSignInRemainderMail($event, $manager, 'invalid-token', $eventSignInDeadline, $manager);
                \Mail::send($email);
            }
        }
    }
}
