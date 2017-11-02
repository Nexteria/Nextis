<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;
use App\NxEventTerm;

class AutogenerateHostAttendanceMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:hostAttendanceMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends remainder to host about filling who was present at event';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $now = Carbon::now('Europe/Bratislava')->format('Y-m-d H:i');

        foreach (NxEventTerm::whereRaw('eventEndDateTime < NOW()')->whereNotNull('hostId')->get() as $term) {
            $event = $term->event;
            if (!$event || $event->status !== 'published') {
                continue;
            }

            $settings = $event->getSettings();
            $remainderDate = $term->eventEndDateTime->addHours(1)->format('Y-m-d H:i');

            if ($remainderDate === $now) {
                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);
                $host = \App\User::findOrFail($term->hostId);
                $email = new \App\Mail\Events\EventHostAttendanceMail($event, $term, $host, $manager);
                \Mail::send($email);
            }
        }
    }
}
