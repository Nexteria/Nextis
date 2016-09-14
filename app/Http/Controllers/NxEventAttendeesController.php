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
            $attendee->signedIn = Carbon::now();
            $attendee->signedOut = null;
            $attendee->wontGo = null;
            $attendee->signedOutReason = '';
        }

        if (\Input::has('signOut') && \Input::get('signOut')) {
            if (!\Input::has('reason')) {
              return response()->json([
                'error' => 'Please provide reason why are you canceling your attendance',
              ], 400);
            }

            $attendee->signedOut = Carbon::now();
            $attendee->signedOutReason = clean(\Input::get('reason'));
            $attendee->wontGo = null;
            $attendee->signedIn = null;
        }

        if (\Input::has('wontGoFlag') && \Input::get('wontGoFlag')) {
            $attendee->wontGo = Carbon::now();
        }

        $attendee->save();

        return response()->json($this->nxEventAttendeeTransformer->transform($attendee));
    }
}
