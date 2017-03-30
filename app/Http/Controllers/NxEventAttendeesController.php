<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\NxEventAttendee as NxEventAttendee;
use Carbon\Carbon;
use App\Events\EventAttendeePlaceReleased;

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

    public function updateSignInByToken($signInToken)
    {
        $attendee = NxEventAttendee::where('signInToken', '=', $signInToken)->first();
        if ($attendee) {
            $group = $attendee->attendeesGroup;
            if (!is_null($attendee->signedIn)) {
                return view('events.sign_in_by_token', [
                  'message' => trans('events.canChangeStatusToWontGo', ['eventName' => $group->nxEvent->name]),
                  'attendeeName' => $attendee->user->firstName,
                  'signInFailed' => true,
                ]);
            }

            // check if max group capacity was reached
            $signedIn = $group->attendees()->whereNotNull('signedIn')->count();
            if ($signedIn >= $group->maxCapacity) {
                return view('events.sign_in_by_token', [
                  'message' => trans('events.groupSignInsAreMaxed', ['eventName' => $group->nxEvent->name]),
                  'attendeeName' => $attendee->user->firstName,
                  'signInFailed' => true,
                ]);
            }

            $event = $attendee->attendeesGroup->nxEvent;
            $signedIn = 0;
            foreach ($event->attendeesGroups as $group) {
                $signedIn += $group->attendees()->whereNotNull('signedIn')->count();
            }

            if ($signedIn >= $event->maxCapacity) {
                return view('events.sign_in_by_token', [
                  'message' => trans('events.eventSignInsAreMaxed', ['eventName' => $group->nxEvent->name]),
                  'attendeeName' => $attendee->user->firstName,
                  'signInFailed' => true,
                ]);
            }

            $attendeesToSignIn = [$attendee];
            foreach ($attendeesToSignIn as $eventAttendee) {
                $eventAttendee->signedIn = Carbon::now();
                $eventAttendee->signedOut = null;
                $eventAttendee->standIn = null;
                $eventAttendee->wontGo = null;
                $eventAttendee->signedOutReason = '';
                $eventAttendee->save();
            }

            return view('events.sign_in_by_token', [
              'message' => trans('events.signInByTokenSuccess', ['eventName' => $group->nxEvent->name]),
              'attendeeName' => $attendee->user->firstName,
              'signInFailed' => false,
            ]);
        }

        return view('events.sign_in_by_token', [
          'message' => trans('events.sorryCanNotDoIt'),
          'attendeeName' => '',
          'signInFailed' => true,
        ]);
    }

    public function updateWontGoByToken($signInToken)
    {
        $attendee = NxEventAttendee::where('signInToken', '=', $signInToken)->first();
        if ($attendee) {
            $event = $attendee->event();
            $group = $attendee->attendeesGroup;

            if (!is_null($attendee->signedIn) || !is_null($attendee->signedOut)) {
                return view('events.sign_in_by_token', [
                  'message' => trans('events.canChangeStatusToWontGo', ['eventName' => $group->nxEvent->name]),
                  'attendeeName' => $attendee->user->firstName,
                  'signInFailed' => true,
                ]);
            }

            if ((!\Input::has('reason') || strlen(\Input::get('reason')) < 100) && $event->mandatoryParticipation) {
                return view('events.sign_in_by_token', [
                  'message' => trans('events.reasonIsRequiredForWontGo', ['eventName' => $group->nxEvent->name]),
                  'attendeeName' => $attendee->user->firstName,
                  'wontGo' => true,
                  'signInFailed' => true,
                ]);
            }

            $attendeesWontGo = [$attendee];
            if ($event->groupedEvents->count() > 0) {
                foreach ($event->groupedEvents as $gEvent) {
                    $eventAttendee = NxEventAttendee::where('userId', '=', $attendee->user->id)
                      ->whereHas('attendeesGroup', function ($query) use ($gEvent) {
                          $query->where('eventId', '=', $gEvent->id);
                      })->first();

                    $attendeesWontGo[] = $eventAttendee;
                }
            }

            foreach ($attendeesWontGo as $eventAttendee) {
                $eventAttendee->wontGo = Carbon::now();
                if (\Input::has('reason')) {
                    $eventAttendee->signedOutReason = clean(\Input::get('reason'));
                }

                $eventAttendee->save();
            }

            return view('events.sign_in_by_token', [
              'message' => trans('events.wontGoByTokenSuccess', ['eventName' => $group->nxEvent->name]),
              'attendeeName' => $attendee->user->firstName,
              'signInFailed' => false,
            ]);
        }

        return view('events.sign_in_by_token', [
              'message' => trans('events.sorryCanNotDoIt'),
              'attendeeName' => '',
              'signInFailed' => true,
            ]);
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

        if (\Input::has('standIn')) {
            if (\Input::get('standIn')) {
                $attendeesToSign = [$attendee];
                foreach ($attendeesToSign as $eventAttendee) {
                    $eventAttendee->standIn = Carbon::now();
                    $eventAttendee->save();
                }
            } else {
                $attendeesToSign = [$attendee];
                foreach ($attendeesToSign as $eventAttendee) {
                    $eventAttendee->standIn = null;
                    $eventAttendee->save();
                }
            }
        }

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
                $eventAttendee->standIn = null;
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

            // check if event is full
            $signedIn = 0;
            foreach ($event->attendeesGroups as $group) {
                $signedIn += $group->attendees()->whereNotNull('signedIn')->count();
            }

            $wasFull = false;
            if ($signedIn >= $event->maxCapacity) {
                $wasFull = true;
            }

            foreach ($attendeesToSignOut as $eventAttendee) {
                $eventAttendee->signedOut = Carbon::now();
                $eventAttendee->signedOutReason = clean(\Input::get('reason'));
                $eventAttendee->wontGo = null;
                $eventAttendee->signedIn = null;
                $eventAttendee->standIn = null;
                $eventAttendee->save();
            }

            if ($wasFull) {
                event(new EventAttendeePlaceReleased($event));
            }
        }

        if (\Input::has('wontGoFlag') && \Input::get('wontGoFlag')) {
            $event = \App\NxEvent::find($eventId);

            if (!\Input::has('reason') && $event->mandatoryParticipation) {
                return response()->json([
                  'error' => 'Please provide reason why you wont be able to attend this event.',
                ], 400);
            }

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
                $eventAttendee->standIn = null;
                $eventAttendee->signedIn = null;
                $eventAttendee->signedOut = null;
                if (\Input::has('reason')) {
                    $eventAttendee->signedOutReason = clean(\Input::get('reason'));
                }

                $eventAttendee->save();
            }
        }

        $attendee->save();

        return response()->json($this->nxEventAttendeeTransformer->transform($attendee));
    }
}
