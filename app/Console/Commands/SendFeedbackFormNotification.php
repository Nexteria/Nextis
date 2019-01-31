<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;
use App\NxEventTerm;

class SendFeedbackFormNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:feedbackFormNotification {--termId=}';

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
        $termId = $this->option('termId');
        $term = NxEventTerm::findOrFail($termId);

        $event = $term->event;
        if (!$event || $term->feedbackLink == '' || $event->status !== 'published') {
            return;
        }

        $settings = $event->getSettings();
        $manager = \App\User::findOrFail($settings['eventsManagerUserId']);

        foreach ($term->attendees as $attendee) {
            if ($attendee->pivot->wasPresent) {
                if ($attendee->student && $attendee->student->status !== 'active') {
                    continue;
                }
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
