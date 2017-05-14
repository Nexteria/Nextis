<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class EventFeedbackMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userFirstName;
    public $userEmail;
    public $eventManagerPhone;
    public $eventManagerName;
    public $eventName;
    public $feedbackDeadline;
    public $feedbackLink;
    public $eventType;
    public $emailTagBase;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\User $user, \App\User $manager)
    {
        $this->userFirstName = $user->firstName;
        $this->eventManagerName = $manager->firstName.' '.$manager->lastName;
        $this->eventManagerPhone = $manager->phone;
        $this->eventName = $event->name;
        $this->userEmail = $user->email;
        $this->eventType = Str::upper($event->eventType);
        $this->feedbackLink = $event->publicFeedbackLink;
        $this->emailTagBase = $event->emailTagBase;

        $settings = $event->getSettings();
        $daysToDeadlineFromStart = $settings['feedbackDaysToFill'] + $settings['feedbackEmailDelay'] + 1;
        $this->feedbackDeadline = $event->eventEndDateTime->addDays($daysToDeadlineFromStart)->format('d.m.Y');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->userEmail)
                    ->subject('[NLA '.$this->eventType.'] FEEDBACK, '.$this->eventName.' deadline do '.$this->feedbackDeadline)
                    ->view('emails.events.event_feedback_email');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'feedback-notification');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'feedback-notification-'.$this->emailTagBase);
        });
    }
}
