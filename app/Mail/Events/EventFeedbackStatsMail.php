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

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, $expectedFilledCount, $actualFiledCount, \App\User $manager)
    {
        $this->eventManagerFirstName = $manager->firstName;
        $this->eventManagerEmail = $manager->email;
        $this->eventName = $event->name;
        $this->eventType = Str::upper($event->eventType);
        $this->formLink = $event->feedbackLink;
        $this->actualFiledCount = $actualFiledCount;
        $this->expectedFilledCount = $expectedFilledCount;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->to($this->eventManagerEmail)
                    ->subject('[NLA '.$this->eventType.'] FEEDBACK, STATS, '.$this->eventName)
                    ->view('emails.events.event_feedback_stats');
    }
}
