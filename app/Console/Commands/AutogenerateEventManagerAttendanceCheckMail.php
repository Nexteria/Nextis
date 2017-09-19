<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

class AutogenerateEventManagerAttendanceCheckMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:eventManagerAttendanceCheckMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends remainder to manager about filling who was present at event';

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
            $remainderDate = $event->eventEndDateTime->addHours(1)->format('Y-m-d H:i');

            $settings = $event->getSettings();
            if ($remainderDate === $now) {
                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);
                $email = new \App\Mail\Events\EventManagerAttendanceCheckMail($event, $manager);
                \Mail::send($email);
            }
        }
    }
}
