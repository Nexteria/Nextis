<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class FillFeedbackNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $eventName;
    public $feedbackDeadline;
    public $feedbackLink;
    public $eventType;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\User $user)
    {
        $this->user = $user;
        $this->eventName = $event->name;
        $this->eventType = Str::upper($event->eventType);
        $this->feedbackLink = $event->feedbackLink;
        $this->feedbackDeadline = \Carbon\Carbon::createFromFormat('Y-m-d', $event->feedbackDeadlineAt)->format('d.m.Y');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->to($this->user->email)
                    ->subject('[NLA '.$this->eventType.'] FEEDBACK, '.$this->eventName.' deadline do '.$this->feedbackDeadline)
                    ->view('emails.events.fill_feedback_notification');
    }
}
