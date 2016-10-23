<?php namespace App\Transformers;


class NxEventAttendeeTransformer extends Transformer
{

    public function transform($attendee)
    {

        return [
            'attendeeTableId' => (int) $attendee->id,
            'id' => (int) $attendee->user->id,
            'attendeesGroupId' => (int) $attendee->attendeesGroupId,
            'signedIn' => $attendee->signedIn ? $attendee->signedIn->__toString() : null,
            'signedOut' => $attendee->signedOut ? $attendee->signedOut->__toString() : null,
            'wontGo' => $attendee->wontGo ? $attendee->wontGo->__toString() : null,
            'signedOutReason' => $attendee->signedOutReason,
            'wasPresent' => (boolean) $attendee->wasPresent,
            'filledFeedback' => (boolean) $attendee->filledFeedback,
            'event' => $attendee->event(),
         ];
    }
}
