<?php namespace App\Transformers\Student;

use App\Transformers\QuestionFormTransformer;
use App\Transformers\Transformer;
use App\Transformers\NxEventTermTransformer;
use App\Transformers\NxEventAttendeeTransformer;

class NxEventTransformer extends Transformer
{

    public function transform($event)
    {
        $attendee = $event->attendees()->where('userId', \Auth::user()->id)->first();
        $transformer = new NxEventTermTransformer();
        $terms = $transformer->transformCollection($event->terms()->whereNull('parentTermId')->get());

        $signedIn = false;
        $attendeeTransformer = new NxEventAttendeeTransformer();
        $terms = $terms->map(function ($term) use ($event, $attendeeTransformer, $attendee) {
            $term['canViewerSignIn'] = false;
            $attedeeModel = \App\NxEventTerm::find($term['id'])
                                                ->attendees()
                                                ->where('userId', \Auth::user()->id)
                                                ->first();

            if ($attedeeModel) {
                $term['attendee'] = $attendeeTransformer->transform($attedeeModel, []);
                $canViewerSignIn = $event->canSignInAttendee($attedeeModel, $term['id']);

                if ($term['attendee']['signedIn']) {
                    $signedIn = true;
                }
            } else {
                if ($attendee) {
                    $canViewerSignIn = $event->canSignInAttendee($attendee, $term['id']);
                } else {
                    $canViewerSignIn = [
                        'canSignIn' => false,
                        'codename' => 'not_invited'
                    ];
                }
            }

            $term['canViewerSignIn'] = $canViewerSignIn['canSignIn'];
            $term['canViewerSignInMessageCodename'] = $canViewerSignIn['codename'];

            return $term;
        });

        $transformer = new QuestionFormTransformer();
        $form = $event->form ? $transformer->transform($event->form) : null;

        $result = [
            'id' => (int) $event->id,
            'name' => $event->name,
            'eventType' => $event->eventType,
            'description' => $event->description,
            'shortDescription' => $event->shortDescription,
            'activityPoints' => (int) $event->activityPoints,
            'mandatoryParticipation' => $event->mandatoryParticipation,
            'lectors' => array_map('intval', $event->lectors()->pluck('id')->toArray()),
            'parentEventId' => $event->getParentEvent() ? (int) $event->getParentEvent()->id : null,
            'status' => $event->status,
            'groupedEvents' => array_map('intval', $event->groupedEvents()->pluck('id')->toArray()),
            'exclusionaryEvents' => array_map('intval', $event->exclusionaryEvents()->pluck('id')->toArray()),
            'curriculumLevelId' => (int) $event->curriculumLevelId,
            'semester' => $event->semester ? (int) $event->semester->id : null,
            'questionForm' => $form,
            'terms' => $terms,
            'attendingNumbers' => [
                'invited' => $event->attendees()->count(),
                'signedIn' => $event->attendees()->whereNotNull('signedIn')->count(),
                'standIns' => $event->attendees()->whereNotNull('standIn')->count(),
            ],
            'viewer' => [
                'signUpOpenDateTime' => null,
                'signUpDeadlineDateTime' => null,
                'isInvited' => $attendee ? true : false,
                'attendee' => null,
            ],
         ];

        if ($attendee) {
            $group = $attendee->attendeesGroup;
            $result['viewer']['signUpOpenDateTime'] = $group->signUpOpenDateTime ? $group->signUpOpenDateTime->toDateTimeString() : null;
            $result['viewer']['signUpDeadlineDateTime'] = $group->signUpDeadlineDateTime ? $group->signUpDeadlineDateTime->toDateTimeString() : null;
            $result['viewer']['attendee'] = [
                'id' => (int) $attendee->user->id,
                'attendeesGroupId' => (int) $attendee->attendeesGroupId,
                'signedIn' => $attendee->signedIn ? $attendee->signedIn->__toString() : null,
                'standIn' => $attendee->standIn ? $attendee->standIn->__toString() : null,
                'signedOut' => $attendee->signedOut ? $attendee->signedOut->__toString() : null,
                'wontGo' => $attendee->wontGo ? $attendee->wontGo->__toString() : null,
                'signedOutReason' => $attendee->signedOutReason,
                'wasPresent' => (boolean) $attendee->wasPresent,
                'filledFeedback' => (boolean) $attendee->filledFeedback,
            ];
        }

        return $result;
    }
}
