<?php namespace App\Transformers;

use App\Transformers\AttendeesGroupTransformer;
use App\Transformers\QuestionFormTransformer;
use App\Transformers\NxEventTermTransformer;

class NxEventTransformer extends Transformer
{

    public function transform($event)
    {
        $transformer = new AttendeesGroupTransformer();
        $attendees = $transformer->transformCollection($event->attendeesGroups);

        $attendee = $event->attendees()->where('userId', \Auth::user()->id)->first();
        $transformer = new NxEventTermTransformer();
        $terms = $transformer->transformCollection($event->terms()->whereNull('parentTermId')->get());

        $transformer = new NxEventAttendeeTransformer();
        $terms = $terms->map(function ($term) use ($attendee, $event, $transformer) {
            $term['canViewerSignIn'] = false;
            try {
                $term['attendee'] = $transformer->transform($attendee);
                $canViewerSignIn = $event->canSignInAttendee($attendee, $term['id'])['canSignIn'] === true;
                $term['canViewerSignIn'] = $canViewerSignIn;
            } catch (\Exception $e) {
                \Log::error($e->getMessage());
            }

            return $term;
        });

        $transformer = new QuestionFormTransformer();
        $form = $event->form ? $transformer->transform($event->form) : null;

        return [
            'id' => (int) $event->id,
            'name' => $event->name,
            'eventType' => $event->eventType,
            'feedbackLink' => $event->feedbackLink,
            'publicFeedbackLink' => $event->publicFeedbackLink,
            'description' => $event->description,
            'shortDescription' => $event->shortDescription,
            'activityPoints' => (int) $event->activityPoints,
            'mandatoryParticipation' => $event->mandatoryParticipation,
            'attendeesGroups' => $attendees,
            'lectors' => array_map('intval', $event->lectors->pluck('id')->toArray()),
            'parentEventId' => $event->getParentEvent() ? (int) $event->getParentEvent()->id : null,
            'status' => $event->status,
            'groupedEvents' => array_map('intval', $event->groupedEvents->pluck('id')->toArray()),
            'exclusionaryEvents' => array_map('intval', $event->exclusionaryEvents->pluck('id')->toArray()),
            'curriculumLevelId' => (int) $event->curriculumLevelId,
            'semester' => $event->semester ? (int) $event->semester->id : null,
            'questionForm' => $form,
            'terms' => $terms,
         ];
    }
}
