<?php

namespace App\Mail\Events;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class HostNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $eventStartTime;
    public $eventName;
    public $hostFirstName;
    public $hostEmail;
    public $eventType;
    public $eventManagerName;
    public $eventManagerPhone;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\User $host, \App\User $manager)
    {
        $this->eventName = $event->name;
        $this->eventType = Str::upper($event->eventType);
        $this->hostFirstName = $host->firstName;
        $this->hostEmail = $host->email;
        $this->eventManagerName = $manager->firstName.' '.$manager->lastName;
        $this->eventManagerPhone = $manager->phone;
        $this->eventStartTime = $event->eventStartDateTime->format('j.n.Y H:i');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->to($this->hostEmail)
                    ->subject('[NLA '.$this->eventType.'] Úloha hosta na '.$this->eventName)
                    ->view('emails.events.host_notification');
    }
}
