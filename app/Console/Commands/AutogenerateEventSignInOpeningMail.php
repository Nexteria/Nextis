<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

class AutogenerateEventSignInOpeningMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:eventSignInOpeningMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends notification about event signin opening';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $now = Carbon::now('Europe/Bratislava')->format('Y-m-d H:i');

        foreach (NxEvent::where('status', 'published')->get() as $event) {
            if ($event->getParentEvent()) {
                continue;
            }

            $settings = $event->getSettings();
            $manager = \App\User::findOrFail($settings['eventsManagerUserId']);

            $isOpening = false;
            $eventSignInDeadline = '';
            foreach ($event->attendeesGroups as $group) {
                if ($group->signUpOpenDateTime->format('Y-m-d H:i') === $now) {
                    $eventSignInDeadline = $group->signUpDeadlineDateTime->format('j.n.Y H:i');

                    foreach ($group->attendees as $attendee) {
                        $email = new \App\Mail\Events\EventSignInOpeningMail($event, $attendee->user, $attendee->signInToken, $eventSignInDeadline, $manager);
                        \Mail::send($email);
                    }
                    $isOpening = true;
                }
            }

            $sendCopyToManager = boolval($settings['sentCopyOfAllEventNotificationsToManager']);
            if ($sendCopyToManager && $isOpening) {
                $email = new \App\Mail\Events\EventSignInOpeningMail($event, $manager, 'invalid-token', $eventSignInDeadline, $manager);
                \Mail::send($email);
            }
        }
    }
}
