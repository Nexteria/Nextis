<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class EventHostAttendanceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $todayDate;
    public $eventId;
    public $eventName;
    public $hostFirstName;
    public $hostEmail;
    public $eventType;
    public $eventManagerName;
    public $eventManagerPhone;
    public $emailTagBase;

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
        $this->hostFirstName = $host->firstName;
        $this->hostEmail = $host->email;
        $this->eventManagerName = $manager->firstName.' '.$manager->lastName;
        $this->eventManagerPhone = $manager->phone;
        $this->todayDate = \Carbon\Carbon::now()->format('d.m.Y');
        $this->emailTagBase = $event->emailTagBase;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->hostEmail)
             ->subject('[NLA '.$this->eventType.'] ÚČASŤ, '.$this->eventName.' deadline do '.$this->todayDate)
             ->view('emails.events.event_host_attendance');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'host-attendance-check');
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'host-attendance-check-'.$this->emailTagBase);
        });
    }
}
