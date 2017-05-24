<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

class AutogenerateFeedbackStatsMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:feedbackStatsMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends feedback stats to manager';

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
            $feedbackDeadline = $event->eventEndDateTime
                                      ->addDays($settings['feedbackDaysToFill'] + $settings['feedbackEmailDelay'] + 1)
                                      ->format('Y-m-d');

            $settings = $event->getSettings();
            if ($feedbackDeadline === $today) {
                $maxRetries = 50;
                while ($maxRetries > 0) {
                    try {
                        $respondentsEmails = \FeedbackForms::getRespondents($event->feedbackLink)['respondents'];
                    } catch (\Exception $e) {
                        \Log::error($e->getMessage());
                        $maxRetries = $maxRetries - 1;
                        continue;
                    }
                    $maxRetries = 0;
                }
                
                $expectedFilledCount = 0;
                $actualFilledCount = 0;

                $userIds = \App\User::whereIn('email', $respondentsEmails)->pluck('id');
                foreach ($event->attendeesGroups as $group) {
                    $attendees = $group->attendees()->where(function ($query) use ($userIds) {
                        $query->whereIn('userId', $userIds);
                        $query->orWhere('filledFeedback', '=', true);
                    })->get();

                    foreach ($attendees as $attendee) {
                        $attendee->filledFeedback = true;
                        $attendee->save();
                    }

                    $actualFilledCount += $group->attendees()->where('wasPresent', '=', true)
                                                             ->where('filledFeedback', '=', true)
                                                             ->count();

                    $expectedFilledCount += $group->attendees()->where('wasPresent', '=', true)->count();
                }

                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);
                $email = new \App\Mail\Events\EventFeedbackStatsMail($event, $expectedFilledCount, $actualFilledCount, $manager);
                \Mail::send($email);
            }
        }
    }
}
