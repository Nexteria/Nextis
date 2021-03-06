<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class EventNotEnoughPeopleMail extends Mailable
{
    use Queueable, SerializesModels;

    public $eventManagerName;
    public $eventName;
    public $eventType;
    public $managerEmail;
    public $actualCapacity;
    public $maxCapacity;
    public $minCapacity;
    public $emailTagBase;
    public $eventTerm;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\NxEventTerm $term, $actualCapacity, \App\User $manager)
    {
        $this->eventName = $event->name;
        $this->eventType = Str::upper($event->eventType);
        $this->actualCapacity = $actualCapacity;
        $this->eventManagerName = $manager->firstName;
        $this->managerEmail = $manager->email;
        $this->minCapacity = $term->minCapacity;
        $this->maxCapacity = $term->maxCapacity;
        $this->eventTerm = $term->eventStartDateTime->format('d.m.Y');
        $this->emailTagBase = $event->emailTagBase;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->managerEmail)
             ->subject('[Nexteria Space] MALÝ POČET PRIHLÁSENÝCH, '.$this->eventType.' '.$this->eventName)
             ->view('emails.events.event_not_enought_people');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-not-enough-people');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'event-not-enough-people-'.$this->emailTagBase);
        });
    }
}
