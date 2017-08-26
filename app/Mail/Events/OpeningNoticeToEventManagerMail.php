<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class OpeningNoticeToEventManagerMail extends Mailable
{
    use Queueable, SerializesModels;

    public $eventId;
    public $eventName;
    public $eventType;
    public $eventManagerName;
    public $feedbackCheckDay;
    public $hostName;
    public $emailTagBase;

    public $eventLocation;
    public $eventLocationName;
    public $eventStartTime;
    public $lectorsFirstName;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\User $host, \App\User $manager)
    {
        $this->eventName = $event->name;
        $this->eventType = Str::upper($event->eventType);
        $this->eventId = $event->id;
        $this->eventManagerName = $manager->firstName;
        $this->managerEmail = $manager->email;
        $this->hostName = $host->firstName.' '.$host->lastName;
        $this->eventLocation = $event->location;
        $this->eventStartTime = $event->eventStartDateTime->format('j.n.Y H:i');
        $this->emailTagBase = $event->emailTagBase;

        $lectors = $event->lectors;
        $this->lectorsFirstName = '';

        foreach ($lectors as $index => $lector) {
            if ($index) {
                $this->lectorsFirstName .= ', ';
            }
            $this->lectorsFirstName .= $lector->firstName.' '.$lector->lastName;
        }

        $eventLocationName = $this->eventLocation->name.' (';
        $eventLocationName .= $this->eventLocation->addressLine1;
        if ($this->eventLocation->addressLine2) {
            $eventLocationName .= ', '.$this->eventLocation->addressLine2;
        }

        $eventLocationName .= ', '.$this->eventLocation->city;
        $eventLocationName .= ', '.$this->eventLocation->zipCode;
        $eventLocationName .= ', '.$this->eventLocation->countryCode.')';
        $this->eventLocationName = $eventLocationName;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->managerEmail)
             ->subject('[NLA '.$this->eventType.'] OTVORENIE PRIHLASOVANIA NOTIFICATION, '.$this->eventName)
             ->view('emails.events.opening_notice_to_event_manager');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-opening-notice-event-manager');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-opening-notice-event-manager-'.$this->emailTagBase);
        });
    }
}
