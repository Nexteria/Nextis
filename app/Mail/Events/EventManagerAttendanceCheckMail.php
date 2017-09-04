<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class EventManagerAttendanceCheckMail extends Mailable
{
    use Queueable, SerializesModels;

    public $eventId;
    public $eventName;
    public $eventType;
    public $eventManagerName;
    public $feedbackCheckDay;
    public $managerDeadline;
    public $emailTagBase;
    public $eventTerm;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\NxEventTerm $term, \App\User $manager)
    {
        $this->eventName = $event->name;
        $this->eventType = $this->eventType === 'other' ? '' : Str::upper($event->eventType);
        $this->eventId = $event->id;
        $this->eventManagerName = $manager->firstName;
        $this->eventTerm = $term->eventStartDateTime->format('d.m.Y');
        $this->managerEmail = $manager->email;
        $this->emailTagBase = $event->emailTagBase;

        $settings = $event->getSettings();
        $this->feedbackCheckDay = $term->eventEndDateTime->addDays($settings['feedbackEmailDelay'])->format('d.m.Y');
        $this->managerDeadline = $term->eventEndDateTime->addDays($settings['feedbackEmailDelay'] - 1)->format('d.m.Y');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->managerEmail)
             ->subject('[NLA '.$this->eventType.'] ÚČASŤ, '.$this->eventName.' deadline do '.$this->managerDeadline)
             ->view('emails.events.event_manager_attendance_check');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-manager-attendance-check');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-manager-attendance-check-'.$this->emailTagBase);
        });
    }
}
