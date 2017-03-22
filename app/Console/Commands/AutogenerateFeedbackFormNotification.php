<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

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

        foreach (NxEvent::all() as $event) {
            if ($event->emailFeedbackLinkAt === $today) {
                foreach ($event->attendeesGroups as $group) {
                    foreach ($group->attendees as $attendee) {
                        if ($attendee->wasPresent) {
                            // $email = new \App\Mail\Events\FillFeedbackNotification($event, $attendee->user);
                            // \Mail::send($email);
                        }
                    }
                }
            }
        }
    }
}
