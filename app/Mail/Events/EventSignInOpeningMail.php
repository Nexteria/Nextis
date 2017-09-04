<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class EventSignInOpeningMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userFirstName;
    public $userEmail;
    public $eventManagerPhone;
    public $eventManagerName;
    public $eventName;
    public $eventType;
    public $eventShortDescription;
    public $eventId;
    public $emailTagBase;

    public $eventLocation;
    public $eventLocationName;
    public $eventStartTime;
    public $eventSignInDeadline;
    public $lectorsFirstName;
    public $signInToken;
    public $isMultiterm;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\User $user, $signInToken, $eventSignInDeadline, \App\User $manager)
    {
        $firstTerm = $event->terms()->whereNull('parentTermId')->first();
        $this->userFirstName = $user->firstName;
        $this->eventManagerName = $manager->firstName.' '.$manager->lastName;
        $this->eventManagerPhone = $manager->phone;
        $this->eventName = $event->name;
        $this->eventId = $event->id;
        $this->signInToken = $signInToken;
        $this->eventShortDescription = $event->shortDescription;
        $this->userEmail = $user->email;
        $this->eventType = Str::upper($event->eventType);
        $this->eventLocation = $firstTerm->location;
        $this->eventSignInDeadline = $eventSignInDeadline;
        $this->emailTagBase = $event->emailTagBase;
        $this->isMultiterm = $event->isMultiterm();
        $this->eventStartTime = $firstTerm->eventStartDateTime->format('j.n.Y H:i');

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
        if ($this->isMultiterm) {
            $this->to($this->userEmail)
                ->subject('[NLA '.$this->eventType.'] '.$this->eventName.' deadline do '.$this->eventSignInDeadline.' PRIHLASOVANIE')
                ->view('emails.events.event_signin_multiterm_opening');
        } else {
            $this->to($this->userEmail)
                ->subject('[NLA '.$this->eventType.'] '.$this->eventName.' deadline do '.$this->eventSignInDeadline.' PRIHLASOVANIE')
                ->view('emails.events.event_signin_opening');
        }
        

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-signin-opening');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-signin-opening-'.$this->emailTagBase);
        });
    }
}
