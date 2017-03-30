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

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\NxEvent $event, \App\User $manager)
    {
        $this->eventName = $event->name;
        $this->eventType = Str::upper($event->eventType);
        $this->eventId = $event->id;
        $this->eventManagerName = $manager->firstName;
        $this->managerEmail = $manager->email;

        $settings = $event->getSettings();
        $this->feedbackCheckDay = $event->eventEndDateTime->addDays($settings['feedbackEmailDelay'])->format('d.m.Y');
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
    }
}
