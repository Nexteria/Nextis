<?php

namespace App\Listeners;

use App\Events\EventAttendeePlaceReleased;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendEventAteendeePlaceReleasedNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  EventAttendeePlaceReleased  $event
     * @return void
     */
    public function handle(EventAttendeePlaceReleased $event)
    {
        $standInAttendees = collect([]);
        foreach ($event->nxEvent->attendeesGroups as $group) {
            $groupStandIn = $group->attendees()->whereNotNull('standIn')->get();
            $standInAttendees = $standInAttendees->merge($groupStandIn);
        }

        $settings = $event->nxEvent->getSettings();
        $manager = \App\User::findOrFail($settings['eventsManagerUserId']);
        foreach ($standInAttendees as $attendee) {
            if ($event->nxEvent->canSignInAttendee($attendee) === true) {
                $email = new \App\Mail\Events\EventFreePlaceMail($event->nxEvent, $attendee->signInToken, $attendee->user, $manager);
                \Mail::send($email);
            }
        }
    }
}
