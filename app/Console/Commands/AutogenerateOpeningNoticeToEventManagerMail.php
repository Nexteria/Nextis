<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

class AutogenerateOpeningNoticeToEventManagerMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:openingNoticeToEventManagerMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends event info to manager before signin opening';

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
                                      ->subDays($settings['eventSignInOpeningManagerNotificationDaysBefore'])
                                      ->format('Y-m-d');

            if ($remainderDate === $today) {
                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);
                $host = \App\User::findOrFail($event->hostId);
                $email = new \App\Mail\Events\OpeningNoticeToEventManagerMail($event, $host, $manager);
                \Mail::send($email);
            }
        }
    }
}
