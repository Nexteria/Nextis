<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\NxEventAttendee as NxEventAttendee;
use App\NxEvent;
use Carbon\Carbon;
use App\Events\EventAttendeePlaceReleased;
use App\Models\QuestionForm\Question;
use App\Models\QuestionForm\Choice;
use App\Models\QuestionForm\Answer;

class NxEventAttendeesController extends Controller
{
    /**
     * @var \App\Transformers\NxEventAttendeeTransformer
     */
    protected $nxEventAttendeeTransformer;

    /**
     * @var \App\Transformers\Student\NxEventTransformer
     */
    protected $nxEventTransformer;

    public function __construct(
        \App\Transformers\NxEventAttendeeTransformer $nxEventAttendeeTransformer,
        \App\Transformers\Student\NxEventTransformer $nxEventTransformer
    ) {
        $this->nxEventAttendeeTransformer = $nxEventAttendeeTransformer;
        $this->nxEventTransformer = $nxEventTransformer;
    }

    public function updateSignInByToken($signInToken)
    {
        $attendee = NxEventAttendee::where('signInToken', '=', $signInToken)->first();
        if ($attendee) {
            $group = $attendee->attendeesGroup;
            if (!is_null($attendee->signedOut) || !is_null($attendee->wontGo)) {
                return response()->json([
                  'message' => trans('events.canChangeStatusToWontGo', ['eventName' => $group->nxEvent->name]),
                ]);
            }

            if (!is_null($attendee->signedIn)) {
                return response()->json([
                    'message' => trans('events.signInByTokenSuccess', ['eventName' => $group->nxEvent->name]),
                ]);
            }


            // check if can signIn to event
            $attendeesToSignIn = [$attendee];
            foreach ($attendeesToSignIn as $eventAttendee) {
                $event = $eventAttendee->attendeesGroup->nxEvent;
                $canSignIn = $event->canSignInAttendee($eventAttendee);
                if ($canSignIn['canSignIn'] !== true) {
                    return response()->json([
                      'message' => $canSignIn['message'],
                    ]);
                }
            }

            if ($attendee->event()->form) {
                $form = $attendee->event()->form;
                $userId = $attendee->userId;
                $answers = $form->getUsersAnswers($userId);
    
                if ($answers->count() == 0 && (!\Input::has('questionForm') || !\Input::get('questionForm'))) {
                    return response()->json([
                        'error' => 'Pri prihlásení je potrebné vyplniť dotazník!',
                    ], 200);
                }
    
                if ($answers->count() == 0) {
                    $questionForm = \Input::get('questionForm');
                    foreach ($questionForm['questions'] as $question) {
                        if ($question['type'] == 'shortText' || $question['type'] == 'longText') {
                            $choice = array_shift($question['choices']);
                            $choice = Choice::findOrFail($choice['id']);
                            $answer = Answer::create([
                                'userId' => $userId,
                                'choiceId' => $choice->id,
                                'answer' => isset($question['answer']) ? $question['answer'] : '',
                            ]);
                        }
    
                        if ($question['type'] == 'choiceList' || $question['type'] == 'selectList') {
                            foreach ($question['choices'] as $chId => $choice) {
                                $choice = Choice::findOrFail($chId);
                                $answer = Answer::create([
                                    'userId' => $userId,
                                    'choiceId' => $choice->id,
                                    'answer' => isset($question['answer']) && $chId === $question['answer'] ? 'selected' : '',
                                ]);
                            }
                        }
    
                        if ($question['type'] == 'multichoice') {
                            foreach ($question['choices'] as $choiceId => $value) {
                                $choice = Choice::findOrFail($choiceId);
                                $answer = Answer::create([
                                    'userId' => $userId,
                                    'choiceId' => $choiceId,
                                    'answer' => isset($question['answer']) && isset($question['answer'][$choiceId]) ? 'selected' : '',
                                ]);
                            }
                        }
                    }
                }
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

            return response()->json([
              'message' => trans('events.signInByTokenSuccess', ['eventName' => $group->nxEvent->name]),
            ]);
        }

        return response()->json([
          'message' => trans('events.sorryCanNotDoIt'),
        ]);
    }

    public function getBasicFormData($signInToken)
    {
        $attendee = NxEventAttendee::where('signInToken', $signInToken)->first();
        if (!$attendee) {
            return response()->json([], 404);
        }

        \Auth::loginUsingId($attendee->user->id);

        return response()->json([
            'isSigned' => !is_null($attendee->signedIn),
            'isSignedOut' => !is_null($attendee->signedOut),
            'wontGo' => !is_null($attendee->wontGo),
            'isEventMandatory' => (bool) $attendee->event()->mandatoryParticipation,
            'signinFormId' => $attendee->event()->signInFormId,
            'eventId' => $attendee->event()->id,
            'viewerId' => $attendee->userId,
            'groupId' => $attendee->attendeesGroupId,
            'groupedEvents' => $this->nxEventTransformer->transformCollection($attendee->event()->groupedEvents),
            'event' => $this->nxEventTransformer->transform($attendee->event()),
        ], 200);
    }

    public function getSigninFormByToken()
    {
        return view('events.sign_in_form_by_token');
    }

    public function updateWontGoByToken($signInToken)
    {
        $attendee = NxEventAttendee::where('signInToken', '=', $signInToken)->first();
        if ($attendee) {
            $event = $attendee->event();
            $group = $attendee->attendeesGroup;

            if (!is_null($attendee->signedIn) || !is_null($attendee->signedOut)) {
                return response()->json([
                  'message' => trans('events.canChangeStatusToWontGo', ['eventName' => $group->nxEvent->name]),
                ], 200);
            }

            if (!is_null($attendee->wontGo)) {
                return response()->json([
                    'message' => trans('events.wontGoByTokenSuccess', ['eventName' => $group->nxEvent->name]),
                    'attendeeName' => $attendee->user->firstName,
                ]);
            }

            if ((!\Input::has('reason') || strlen(\Input::get('reason')) < 10) && $event->mandatoryParticipation) {
                return response()->json([
                  'message' => trans('events.reasonIsRequiredForWontGo', ['eventName' => $group->nxEvent->name]),
                ], 200);
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
                if (!$eventAttendee->wontGo) {
                    $eventAttendee->wontGo = Carbon::now();
                    if (\Input::has('reason')) {
                        $eventAttendee->signedOutReason = clean(\Input::get('reason'));
                    }

                    $eventAttendee->save();
                }
            }

            return response()->json([
              'message' => trans('events.wontGoByTokenSuccess', ['eventName' => $group->nxEvent->name]),
              'attendeeName' => $attendee->user->firstName,
            ]);
        }

        return response()->json([
            'message' => trans('events.sorryCanNotDoIt'),
        ], 200);
    }

    public function updateAttendee($userId)
    {
        $events = \Input::get('events');
        $eventIds = [];
        foreach ($events as $eventId => $data) {
            $eventIds[] = $eventId;
            $attendee = NxEventAttendee::where('userId', '=', $userId)
            ->whereHas('attendeesGroup', function ($query) use ($eventId) {
                $query->where('eventId', '=', $eventId);
            })->first();

            if (!$attendee) {
                abort(401);
            }

            if (\Input::has('signIn') && \Input::get('signIn')) {
                if ($attendee->event()->form) {
                    $form = $attendee->event()->form;
                    $answers = $form->getUsersAnswers($userId);
        
                    if ($answers->count() == 0 && !isset($data['questionForm'])) {
                        return response()->json([
                            'error' => 'Pri prihlásení je potrebné vyplniť dotazník!',
                        ], 400);
                    }
        
                    if ($answers->count() == 0) {
                        $questionForm = $data['questionForm'];
                        foreach ($questionForm['questions'] as $question) {
                            if ($question['type'] == 'shortText' || $question['type'] == 'longText') {
                                $choice = array_shift($question['choices']);
                                $choice = Choice::findOrFail($choice['id']);
                                $answer = Answer::create([
                                    'userId' => $userId,
                                    'choiceId' => $choice->id,
                                    'answer' => isset($question['answer']) ? $question['answer'] : '',
                                ]);
                            }
        
                            if ($question['type'] == 'choiceList' || $question['type'] == 'selectList') {
                                foreach ($question['choices'] as $chId => $choice) {
                                    $choice = Choice::findOrFail($chId);
                                    $answer = Answer::create([
                                        'userId' => $userId,
                                        'choiceId' => $choice->id,
                                        'answer' => isset($question['answer']) && $chId === $question['answer'] ? 'selected' : '',
                                    ]);
                                }
                            }
        
                            if ($question['type'] == 'multichoice') {
                                foreach ($question['choices'] as $choiceId => $value) {
                                    $choice = Choice::findOrFail($choiceId);
                                    $answer = Answer::create([
                                        'userId' => $userId,
                                        'choiceId' => $choiceId,
                                        'answer' => isset($question['answer']) && isset($question['answer'][$choiceId]) ? 'selected' : '',
                                    ]);
                                }
                            }
                        }
                    }
                }

                foreach ($data['terms'] as $termId => $item) {
                    $term = \App\NxEventTerm::findOrFail($termId);
                    $canSignIn = $attendee->event()->canSignInAttendee($attendee, $term->id);

                    if ($canSignIn['canSignIn'] !== true) {
                        return response()->json([
                        'error' => $canSignIn['message'],
                        ], 400);
                    }
                    
                    if (!isset($data['noRecursive']) || !$data['noRecursive']) {
                        // check if can signIn to event
                        foreach ($term->terms as $nextMeeting) {
                            $canSignIn = $attendee->event()->canSignInAttendee($attendee, $nextMeeting->id);
                            if ($canSignIn['canSignIn'] !== true) {
                                return response()->json([
                                'error' => $canSignIn['message'],
                                ], 400);
                            }
                        }
                    }

                    $dataToSync = [];
                    $dataToSync[$term->id] = [
                        'signedIn' => Carbon::now(),
                        'signedOut' => null,
                        'wontGo' => null,
                        'standIn' => null,
                        'signedOutReason' => '',
                    ];
                    $attendee->terms()->sync($dataToSync, false);

                    $attendee->update([
                        'signedIn' => Carbon::now(),
                        'signedOut' => null,
                        'wontGo' => null,
                        'standIn' => null,
                        'signedOutReason' => '',
                    ]);

                    if (!isset($data['noRecursive']) || !$data['noRecursive']) {
                        foreach ($term->terms as $nextMeeting) {
                            $dataToSync = [];
                            $dataToSync[$nextMeeting->id] = [
                                'signedIn' => Carbon::now(),
                                'signedOut' => null,
                                'wontGo' => null,
                                'standIn' => null,
                                'signedOutReason' => '',
                            ];
                            $attendee->terms()->sync($dataToSync, false);
                        }
                    }
                }
            }
        }

        foreach ($events as $eventId => $data) {
            if (\Input::has('standIn')) {
                $attendee = NxEventAttendee::where('userId', '=', $userId)
                                            ->whereHas('attendeesGroup', function ($query) use ($eventId) {
                                                $query->where('eventId', '=', $eventId);
                                            })->first();
                $eventIds[] = $eventId;

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
        }

        foreach ($events as $eventId => $data) {
            if (\Input::has('signOut') && \Input::get('signOut')) {
                if (!\Input::has('reason')) {
                    return response()->json([
                    'error' => 'Dobrý pokus! Prosím napíš nám dôvod prečo sa nezúčastníš.',
                    ], 400);
                }

                $event = \App\NxEvent::find($eventId);
                $term = null;

                if (isset($data['termId']) && $data['termId']) {
                    $term = \App\NxEventTerm::find($data['termId']);
                }

                $attendee = NxEventAttendee::where('userId', '=', $userId)
                ->whereHas('attendeesGroup', function ($query) use ($eventId) {
                    $query->where('eventId', '=', $eventId);
                })->first();

                $attendeesToSignOut = [$attendee];
                if ($event->groupedEvents->count() > 0) {
                    foreach ($event->groupedEvents as $gEvent) {
                        $eventIds[] = $gEvent->id;
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
                    $signedTerms = $eventAttendee->terms()->wherePivot('signedIn', '!=', null)->count();
                    if (!$term || $signedTerms === 1) {
                        $eventAttendee->signedOut = Carbon::now();
                        $eventAttendee->signedOutReason = clean(\Input::get('reason'));
                        $eventAttendee->wontGo = null;
                        $eventAttendee->signedIn = null;
                        $eventAttendee->standIn = null;

                        foreach ($eventAttendee->terms as $attendeeTerm) {
                            $dataToSync = [];
                            $dataToSync[$attendeeTerm->id] = [
                                'signedOut' => Carbon::now(),
                                'signedOutReason' => clean(\Input::get('reason')),
                                'wontGo' => null,
                                'signedIn' => null,
                                'standIn' => null,
                            ];

                            $eventAttendee->terms()->sync($dataToSync, false);
                        }
                    } 
                    if ($term) {
                        $dataToSync = [];
                        $dataToSync[$term->id] = [
                            'signedOut' => Carbon::now(),
                            'signedOutReason' => clean(\Input::get('reason')),
                            'wontGo' => null,
                            'signedIn' => null,
                            'standIn' => null,
                        ];
                        $eventAttendee->terms()->sync($dataToSync, false);
                    }
                    $eventAttendee->save();
                }

                if ($wasFull) {
                    event(new EventAttendeePlaceReleased($event));
                }
            }
        }

        foreach ($events as $eventId => $data) {
            if (\Input::has('wontGoFlag') && \Input::get('wontGoFlag')) {
                $event = \App\NxEvent::find($eventId);
                $eventIds[] = $eventId;

                if (!\Input::has('reason') && $event->mandatoryParticipation) {
                    return response()->json([
                    'error' => 'Please provide reason why you wont be able to attend this event.',
                    ], 400);
                }

                $attendeesWontGo = [$attendee];
                if ($event->groupedEvents->count() > 0) {
                    foreach ($event->groupedEvents as $gEvent) {
                        $eventIds[] = $gEvent->id;
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
        }

        $eventsCollection = \App\NxEvent::whereIn('id', $eventIds)->get();
        return response()->json($this->nxEventTransformer->transformCollection($eventsCollection));
    }

    public function updateEventAttendance(Request $request, $eventId, $attendeeId)
    {
        $event = \App\NxEvent::findOrFail($eventId);
        $attendee = $event->attendees()->where('nx_event_attendees.id', $attendeeId)->first();

        if ($request->has('wasPresent')) {
            $attendee->wasPresent = $request->get('wasPresent');
        }

        if ($request->has('filledFeedback')) {
            $attendee->filledFeedback = $request->get('filledFeedback');
        }

        $attendee->save();

        return response()->json($this->nxEventAttendeeTransformer->transform($attendee));
    }

    public function updateTermAttendance(Request $request, $termId, $attendeeId)
    {
        $term = \App\NxEventTerm::findOrFail($termId);
        $attendee = $term->attendees()
                         ->where('attendeeId', $attendeeId)
                         ->first();

        $dataToSync = [];
        if ($request->has('wasPresent')) {
            $dataToSync[$termId] = [
                'wasPresent' => $request->get('wasPresent'),
            ];
        }

        if ($request->has('filledFeedback')) {
            $dataToSync[$termId] = [
                'filledFeedback' => $request->get('filledFeedback'),
            ];
        }

        $attendee->terms()->sync($dataToSync, false);

        $attendee = $term->attendees()
                         ->where('attendeeId', $attendeeId)
                         ->first();

        return response()->json($this->nxEventAttendeeTransformer->transform($attendee));
    }
}
