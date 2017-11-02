<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;
use App\NxEventTerm;

class AutogenerateFeedbackFormNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:feedbackFormNotification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends feedback form after event';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $today = Carbon::now()->format('Y-m-d');

        foreach (NxEventTerm::whereRaw('eventEndDateTime < NOW()')->get() as $term) {
            $event = $term->event;
            if ($term->feedbackLink == '' || $event->status !== 'published') {
                continue;
            }

            $settings = $event->getSettings();
            $notificationDate = $term->eventEndDateTime->addDays($settings['feedbackEmailDelay'])->format('Y-m-d');
            if ($notificationDate === $today) {
                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);

                foreach ($term->attendees as $attendee) {
                    if ($attendee->wasPresent) {
                        $email = new \App\Mail\Events\EventFeedbackMail($event, $term, $attendee->user, $manager);
                        \Mail::send($email);
                    }
                }

                $sendCopyToManager = boolval($settings['sentCopyOfAllEventNotificationsToManager']);
                if ($sendCopyToManager) {
                    $email = new \App\Mail\Events\EventFeedbackMail($event, $term, $manager, $manager);
                    \Mail::send($email);
                }
            }
        }
    }
}
