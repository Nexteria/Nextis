<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class EventReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userFirstName;
    public $userEmail;
    public $eventManagerPhone;
    public $eventManagerName;
    public $eventName;
    public $eventType;
    public $emailTagBase;

    public $eventLocation;
    public $eventLocationName;
    public $eventStartTime;
    public $hostFirstName;
    public $hostPhone;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\NxEventTerm $term, \App\User $user, \App\User $manager)
    {
        $this->userFirstName = $user->firstName;
        $this->eventManagerName = $manager->firstName.' '.$manager->lastName;
        $this->eventManagerPhone = $manager->phone;
        $this->eventName = $event->name;
        $this->userEmail = $user->email;
        $this->eventType = Str::upper($event->eventType);
        $this->eventLocation = $term->location;
        $this->eventStartTime = $term->eventStartDateTime->format('j.n.Y H:i');
        $this->emailTagBase = $event->emailTagBase;

        $host = \App\User::find($term->hostId);
        $this->hostFirstName = $host ? $host->firstName.' '.$host->lastName : null;
        $this->hostPhone = $host ? $host->phone : null;

        $eventLocationName = $this->eventLocation->name.' (';
        $eventLocationName .= $this->eventLocation->addressLine1;
        if ($this->eventLocation->addressLine2) {
            $eventLocationName .= ', '.$this->eventLocation->addressLine2;
        }

        $eventLocationName .= $this->eventLocation->city;
        $eventLocationName .= ', '.$this->eventLocation->zipCode;
        $eventLocationName .= $this->eventLocation->countryCode.')';
        $this->eventLocationName = $eventLocationName;
    }


    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->userEmail)
                    ->subject('[NLA '.$this->eventType.'] REMINDER, '.$this->eventName.' '.$this->eventStartTime)
                    ->view('emails.events.event_reminder');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-remainder');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-remainder-'.$this->emailTagBase);
        });
    }

}
