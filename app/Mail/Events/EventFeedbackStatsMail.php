<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class EventFeedbackStatsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $expectedFilledCount;
    public $actualFiledCount;
    public $eventName;
    public $eventManagerFirstName;
    public $eventManagerEmail;
    public $eventType;
    public $formLink;
    public $emailTagBase;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\NxEventTerm $term, $expectedFilledCount, $actualFiledCount, \App\User $manager)
    {
        $this->eventManagerFirstName = $manager->firstName;
        $this->eventManagerEmail = $manager->email;
        $this->eventName = $event->name;
        $this->eventType = Str::upper($event->eventType);
        $this->formLink = $term->feedbackLink;
        $this->actualFiledCount = $actualFiledCount;
        $this->expectedFilledCount = $expectedFilledCount;
        $this->emailTagBase = $event->emailTagBase;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->eventManagerEmail)
                    ->subject('[NLA '.$this->eventType.'] FEEDBACK, STATS, '.$this->eventName)
                    ->view('emails.events.event_feedback_stats');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-feedback-stats');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-feedback-stats-'.$this->emailTagBase);
        });
    }
}
