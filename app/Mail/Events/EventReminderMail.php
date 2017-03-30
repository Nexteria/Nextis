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
    public function __construct(\App\NxEvent $event, \App\User $user, \App\User $manager)
    {
        $this->userFirstName = $user->firstName;
        $this->eventManagerName = $manager->firstName.' '.$manager->lastName;
        $this->eventManagerPhone = $manager->phone;
        $this->eventName = $event->name;
        $this->userEmail = $user->email;
        $this->eventType = Str::upper($event->eventType);
        $this->eventLocation = $event->location;
        $this->eventStartTime = $event->eventStartDateTime->format('j.n.Y h:i');

        $host = \App\User::findOrFail($event->hostId);
        $this->hostFirstName = $host->firstName.' '.$host->lastName;
        $this->hostPhone = $host->phone;

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
            $year = \Carbon\Carbon::now()->format('Y');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-remainder');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-remainder-'.Str::ascii($this->eventName).'-'.$year);
        });
    }
}
