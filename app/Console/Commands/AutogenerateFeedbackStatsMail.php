<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\NxEvent;
use App\NxEventTerm;

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

        foreach (NxEventTerm::whereRaw('eventEndDateTime < NOW()')->get() as $term) {
            $event = $term->event;
            if (!$event || $term->feedbackLink == '' || $event->status !== 'published') {
                continue;
            }

            $settings = $event->getSettings();
            $feedbackDeadline = $term->eventEndDateTime
                                      ->addDays($settings['feedbackDaysToFill'] + $settings['feedbackEmailDelay'] + 1)
                                      ->format('Y-m-d');

            $settings = $event->getSettings();
            if ($feedbackDeadline === $today) {
                $maxRetries = 50;
                while ($maxRetries > 0) {
                    try {
                        $respondentsEmails = \FeedbackForms::getRespondents($term->feedbackLink)['respondents'];
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

                $attendees = $term->attendees()->where(function ($query) use ($userIds, $term) {
                    $query->whereIn('userId', $userIds);
                    $query->orWhere($term->attendees()->getTable().'.filledFeedback', '=', true);
                })->get();

                foreach ($attendees as $attendee) {
                    $term->attendees()->updateExistingPivot($attendee->id, ['filledFeedback' => true]);
                    $isLast = !$attendee->terms()->where(function ($query) use ($term) {
                        $query->where('parentTermId', '=', $term->id);
                        if ($term->parentTermId) {
                            $query->orWhere('parentTermId', '=', $term->parentTermId);
                            $query->orWhere($term->getTable().'.id', '=', $term->parentTermId);
                        }
                    })->where(function ($query) use ($attendee) {
                        $query->where($attendee->terms()->getTable().'.filledFeedback', '=', null);
                        $query->orWhere($attendee->terms()->getTable().'.filledFeedback', '=', false);
                    })->exists();

                    if ($isLast) {
                        $attendee->filledFeedback = true;
                        $attendee->save();
                    }
                }

                $actualFilledCount += $term->attendees()->wherePivot('wasPresent', '=', true)
                                                        ->wherePivot('filledFeedback', '=', true)
                                                        ->count();

                $expectedFilledCount += $term->attendees()->wherePivot('wasPresent', '=', true)->count();

                $manager = \App\User::findOrFail($settings['eventsManagerUserId']);
                $email = new \App\Mail\Events\EventFeedbackStatsMail($event, $term, $expectedFilledCount, $actualFilledCount, $manager);
                \Mail::send($email);
            }
        }
    }
}
