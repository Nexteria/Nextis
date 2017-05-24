<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;

class AutogenerateFeedbackFormRemainder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:feedbackFormRemainder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends feedback form remainder before deadline';

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
            $feedbackDeadline = $event->eventEndDateTime->addDays($settings['feedbackDaysToFill'] + $settings['feedbackEmailDelay'] + 1);
            $remainderDate = $feedbackDeadline->subDays($settings['feedbackRemainderDaysBefore'])->format('Y-m-d');

            if ($remainderDate === $today) {
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
                
                $userIds = \App\User::whereIn('email', $respondentsEmails)->pluck('id');
                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);

                foreach ($event->attendeesGroups as $group) {
                    $attendees = $group->attendees()->where(function ($query) use ($userIds) {
                        $query->whereIn('userId', $userIds);
                        $query->orWhere('filledFeedback', '=', true);
                    })->get();
                    foreach ($attendees as $attendee) {
                        $attendee->filledFeedback = true;
                        $attendee->save();
                    }

                    $attendees = $group->attendees()->where('wasPresent', '=', true)->where(function ($query) {
                        $query->where('filledFeedback', '=', false);
                        $query->orWhereNull('filledFeedback');
                    })->get();

                    foreach ($attendees as $attendee) {
                        $email = new \App\Mail\Events\EventFeedbackRemainderMail($event, $attendee->user, $manager);
                        \Mail::send($email);
                    }
                }

                $sendCopyToManager = boolval($settings['sentCopyOfAllEventNotificationsToManager']);
                if ($sendCopyToManager) {
                    $email = new \App\Mail\Events\EventFeedbackRemainderMail($event, $manager, $manager);
                    \Mail::send($email);
                }
            }
        }
    }
}
