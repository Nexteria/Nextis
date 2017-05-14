<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class EventFreePlaceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $eventName;
    public $signInToken;
    public $eventType;

    public $eventLocation;
    public $eventLocationName;
    public $eventStartTime;
    public $eventManagerPhone;
    public $eventManagerName;
    public $emailTagBase;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, $signInToken, \App\User $user, \App\User $manager)
    {
        $this->user = $user;
        $this->eventName = $event->name;
        $this->eventType = Str::upper($event->eventType);
        $this->eventStartTime = $event->eventStartDateTime->format('j.n.Y H:i');
        $this->eventManagerName = $manager->firstName.' '.$manager->lastName;
        $this->eventManagerPhone = $manager->phone;
        $this->eventLocation = $event->location;
        $this->signInToken = $signInToken;
        $this->emailTagBase = $event->emailTagBase;

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
        $this->to($this->user->email)
             ->subject('[NLA '.$this->eventType.'] UVOĽNILO SA MIESTO - '.$this->eventName)
             ->view('emails.events.event_free_place_email');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-free-place-notification');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-free-place-notification-'.$this->emailTagBase);
        });
    }
}
