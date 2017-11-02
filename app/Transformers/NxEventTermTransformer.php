<?php namespace App\Transformers;

class NxEventTermTransformer extends Transformer
{

    public function transform($term)
    {
        $transformer = new NxEventAttendeeTransformer();
        $users = [];
        $viewer = [];
        foreach ($term->attendees as $attendee) {
            $user = $transformer->transform($attendee, []);
            $users[] = $user;
            if ($attendee->userId === \Auth::user()->id) {
                $viewer = $user;
            }
        }

        return [
            'id' => (int) $term->id,
            'attendee' => $viewer,
            'eventStartDateTime' => $term->eventStartDateTime ? $term->eventStartDateTime->toDateTimeString() : null,
            'eventEndDateTime' => $term->eventEndDateTime ? $term->eventEndDateTime->toDateTimeString() : null,
            'minCapacity' => (int) $term->minCapacity,
            'maxCapacity' => (int) $term->maxCapacity,
            'signedInAttendeesCount' => (int) $term->attendees()->whereNull('deleted_at')->wherePivot('signedIn', '!=', null)->count(),
            'hostId' => (int) $term->hostId,
            'userId' => (int) $term->userId,
            'nxLocationId' => (int) $term->nxLocationId,
            'parentTermId' => (int) $term->parentTermId,
            'feedbackLink' => $term->feedbackLink,
            'publicFeedbackLink' => $term->publicFeedbackLink,
            'terms' => $this->transformCollection($term->terms),
            'attendees' => $users,
         ];
    }
}
