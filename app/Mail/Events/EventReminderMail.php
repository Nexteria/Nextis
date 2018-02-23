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
    public function __construct(\App\User $user)
    {
        $this->userFirstName = $user->firstName;
       
      
        $this->userEmail = $user->email;
       
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->userEmail)
                    ->subject('[NLA] Škriatok v systéme')
                    ->view('emails.events.event_reminder');
    }
}
