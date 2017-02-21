<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\NxEventAttendee as NxEventAttendee;
use Carbon\Carbon;

class NxEventAttendeesController extends Controller
{
    /**
     * @var \App\Transformers\NxEventAttendeeTransformer
     */
    protected $nxEventAttendeeTransformer;

    public function __construct(\App\Transformers\NxEventAttendeeTransformer $nxEventAttendeeTransformer)
    {
        $this->nxEventAttendeeTransformer = $nxEventAttendeeTransformer;
    }

    public function updateAttendee($eventId, $userId)
    {
        $attendee = NxEventAttendee::where('userId', '=', $userId)
            ->whereHas('attendeesGroup', function ($query) use ($eventId) {
                $query->where('eventId', '=', $eventId);
            })->first();

        if (!$attendee) {
            abort(401);
        }

        $attendee->fill(\Input::all());

        if (\Input::has('signIn') && \Input::get('signIn')) {
            $attendeesToSignIn = [$attendee];
            if (\Input::has('choosedEvents')) {
                foreach (\Input::get('choosedEvents') as $eId) {
                    $eventAttendee = NxEventAttendee::where('userId', '=', $userId)
                      ->whereHas('attendeesGroup', function ($query) use ($eId) {
                          $query->where('eventId', '=', $eId);
                      })->first();

                    if (!$eventAttendee) {
                        abort(401);
                    }

                    $attendeesToSignIn[] = $eventAttendee;
                }
            }

            // check if max group capacity was reached
            foreach ($attendeesToSignIn as $eventAttendee) {
                $group = $eventAttendee->attendeesGroup;
                $signedIn = $group->attendees()->whereNotNull('signedIn')->count();
                if ($signedIn >= $group->maxCapacity) {
                    return response()->json([
                      'error' => trans('events.groupSignInsAreMaxed', ['eventName' => $group->nxEvent->name]),
                    ], 400);
                }
            }

            // check if event max capacity was reached
            foreach ($attendeesToSignIn as $eventAttendee) {
                $event = $eventAttendee->attendeesGroup->nxEvent;
                $signedIn = 0;
                foreach ($event->attendeesGroups as $group) {
                    $signedIn += $group->attendees()->whereNotNull('signedIn')->count();
                }

                if ($signedIn >= $event->maxCapacity) {
                    return response()->json([
                      'error' => trans('events.eventSignInsAreMaxed', ['eventName' => $group->nxEvent->name]),
                    ], 400);
                }
            }

            foreach ($attendeesToSignIn as $eventAttendee) {
                $eventAttendee->signedIn = Carbon::now();
                $eventAttendee->signedOut = null;
                $eventAttendee->wontGo = null;
                $eventAttendee->signedOutReason = '';
                $eventAttendee->save();
            }
        }

        if (\Input::has('signOut') && \Input::get('signOut')) {
            if (!\Input::has('reason')) {
                return response()->json([
                  'error' => 'Please provide reason why are you canceling your attendance',
                ], 400);
            }

            $event = \App\NxEvent::find($eventId);
            $attendeesToSignOut = [$attendee];
            if ($event->groupedEvents->count() > 0) {
                foreach ($event->groupedEvents as $gEvent) {
                    $eventAttendee = NxEventAttendee::where('userId', '=', $userId)
                      ->whereHas('attendeesGroup', function ($query) use ($gEvent) {
                          $query->where('eventId', '=', $gEvent->id);
                      })->first();

                    if (!$eventAttendee) {
                        abort(401);
                    }

                    if ($eventAttendee->signedIn === null) {
                        continue;
                    }

                    $attendeesToSignOut[] = $eventAttendee;
                }
            }

            foreach ($attendeesToSignOut as $eventAttendee) {
                $eventAttendee->signedOut = Carbon::now();
                $eventAttendee->signedOutReason = clean(\Input::get('reason'));
                $eventAttendee->wontGo = null;
                $eventAttendee->signedIn = null;
                $eventAttendee->save();
            }
        }

        if (\Input::has('wontGoFlag') && \Input::get('wontGoFlag')) {
            $event = \App\NxEvent::find($eventId);
            $attendeesWontGo = [$attendee];
            if ($event->groupedEvents->count() > 0) {
                foreach ($event->groupedEvents as $gEvent) {
                    $eventAttendee = NxEventAttendee::where('userId', '=', $userId)
                      ->whereHas('attendeesGroup', function ($query) use ($gEvent) {
                          $query->where('eventId', '=', $gEvent->id);
                      })->first();

                    if (!$eventAttendee) {
                        abort(401);
                    }

                    $attendeesWontGo[] = $eventAttendee;
                }
            }

            foreach ($attendeesWontGo as $eventAttendee) {
                $eventAttendee->wontGo = Carbon::now();
                $eventAttendee->save();
            }
        }

        $attendee->save();

        return response()->json($this->nxEventAttendeeTransformer->transform($attendee));
    }
}
