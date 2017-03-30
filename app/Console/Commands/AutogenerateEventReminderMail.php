<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

class AutogenerateEventReminderMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:eventReminderMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends remainder about tomorrow event';

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
            $remainderDate = $event->eventStartDateTime
                                   ->subDays(1)
                                   ->format('Y-m-d');

            if ($remainderDate === $today) {
                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);

                foreach ($event->attendeesGroups as $group) {
                    $attendees = $group->attendees()->where('signedIn', '>', '')->get();

                    foreach ($attendees as $attendee) {
                        $email = new \App\Mail\Events\EventReminderMail($event, $attendee->user, $manager);
                        \Mail::send($email);
                    }
                }

                $sendCopyToManager = boolval($settings['sentCopyOfAllEventNotificationsToManager']);
                if ($sendCopyToManager) {
                    $email = new \App\Mail\Events\EventReminderMail($event, $manager, $manager);
                    \Mail::send($email);
                }
            }
        }
    }
}
