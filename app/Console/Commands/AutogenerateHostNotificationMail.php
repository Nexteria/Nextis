<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;
use App\NxEventTerm;

class AutogenerateHostNotificationMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:hostNotificationMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends notification to host about hosting an event';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $today = Carbon::now()->format('Y-m-d');

        foreach (NxEventTerm::whereRaw('eventStartDateTime > NOW()')->whereNotNull('hostId')->get() as $term) {
            $event = $term->event;
            if ($event->status !== 'published') {
                continue;
            }

            if ($event->getParentEvent()) {
                continue;
            }

            $settings = $event->getSettings();
            $notificationDate = $term->eventStartDateTime
                                      ->subDays($settings['hostInstructionEmailDaysBefore'])
                                      ->format('Y-m-d');

            if ($notificationDate === $today) {
                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);
                $host = \App\User::findOrFail($term->hostId);
                $email = new \App\Mail\Events\HostNotificationMail($event, $term, $host, $manager);
                \Mail::send($email);

                $sendCopyToManager = boolval($settings['sentCopyOfAllEventNotificationsToManager']);
                if ($sendCopyToManager) {
                    $email = new \App\Mail\Events\HostNotificationMail($event, $term, $manager, $manager);
                    \Mail::send($email);
                }
            }
        }
    }
}
