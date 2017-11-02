<?php namespace App\Transformers;

use Carbon\Carbon;

class NxEventAttendeeTransformer extends Transformer
{

    public function transform($attendee, $fields = [])
    {
        if ($attendee->pivot) {
            $signedIn = $attendee->pivot->signedIn ? new Carbon($attendee->pivot->signedIn) : null;
            $standIn = $attendee->pivot->standIn ? new Carbon($attendee->pivot->standIn) : null;
            $signedOut = $attendee->pivot->signedOut ? new Carbon($attendee->pivot->signedOut) : null;
            $wontGo = $attendee->pivot->wontGo ? new Carbon($attendee->pivot->wontGo) : null;
            $signedOutReason = $attendee->pivot->signedOutReason;
            $wasPresent = $attendee->pivot->wasPresent;
            $filledFeedback = $attendee->pivot->filledFeedback;
        } else {
            $signedIn = $attendee->signedIn;
            $standIn = $attendee->standIn;
            $signedOut = $attendee->signedOut;
            $wontGo = $attendee->wontGo;
            $signedOutReason = $attendee->signedOutReason;
            $wasPresent = $attendee->wasPresent;
            $filledFeedback = $attendee->filledFeedback;
        }

        $result = [
            'attendeeTableId' => (int) $attendee->id,
            'id' => (int) $attendee->user->id,
            'attendeesGroupId' => (int) $attendee->attendeesGroupId,
            'signedIn' => $signedIn ? $signedIn->__toString() : null,
            'standIn' => $standIn ? $standIn->__toString() : null,
            'signedOut' => $signedOut ? $signedOut->__toString() : null,
            'wontGo' => $wontGo ? $wontGo->__toString() : null,
            'signedOutReason' => $signedOutReason ?? '',
            'wasPresent' => (boolean) $wasPresent,
            'filledFeedback' => (boolean) $filledFeedback,
         ];

        if (in_array('event', $fields)) {
            $result['event'] = $attendee->event();
        }

        return $result;
    }
}
