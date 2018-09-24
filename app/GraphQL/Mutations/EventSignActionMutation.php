<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\NxEventAttendee;
use App\NxEvent;
use Carbon\Carbon;

class EventSignActionMutation extends Mutation
{

    protected $attributes = [
        'name' => 'EventSignAction'
    ];
    
    public function type()
    {
        return GraphQL::type('NxEventAttendee');
    }
    
    public function args()
    {
        return [
            'eventId' => [
                'name' => 'eventId',
                'type' => Type::nonNull(Type::int()),
                'rules' => ['required'],
            ],
            'userId' => [
                'name' => 'userId',
                'type' => Type::nonNull(Type::int()),
            ],
            'action' => [
                'name' => 'action',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['string', 'in:SIGN_IN,SIGN_OUT,WONT_GO'],
            ],
            'terms' => [
                'name' => 'terms',
                'type' => Type::listOf(Type::int()),
                'rules' => ['array'],
            ],
            'reason' => [
                'name' => 'reason',
                'type' => Type::string(),
                'rules' => ['string'],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user) {
            return null;
        }

        $attendee = NxEventAttendee::where('userId', '=', $user->id)
            ->whereHas('attendeesGroup', function ($query) use ($args) {
                $query->where('eventId', '=', $args['eventId']);
            })->firstOrFail();

        if ($args['action'] === 'SIGN_IN') {
            foreach ($args['terms'] as $termId) {
                $term = \App\NxEventTerm::findOrFail($termId);
                $canSignIn = $attendee->event()->canUserSignIn($user->id);

                if ($canSignIn['canSignIn'] !== true) {
                    return new \Exception($canSignIn['message']);
                }

                $canSignIn = $attendee->event()->canSignInAttendee($attendee, $termId);
                if ($canSignIn['canSignIn'] !== true) {
                    return new \Exception($canSignIn['message']);
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

        if ($args['action'] === 'WONT_GO') {
            $event = \App\NxEvent::find($args['eventId']);
            $eventIds[] = $event->id;

            if (!$args['reason'] && $event->mandatoryParticipation) {
                new \Exception('Please provide reason why you wont be able to attend this event.');
            }

            $attendeesWontGo = [$attendee];
            if ($event->groupedEvents->count() > 0) {
                foreach ($event->groupedEvents as $gEvent) {
                    $eventIds[] = $gEvent->id;
                    $eventAttendee = NxEventAttendee::where('userId', '=', $user->id)
                    ->whereHas('attendeesGroup', function ($query) use ($gEvent) {
                        $query->where('eventId', '=', $gEvent->id);
                    })->first();

                    if ($eventAttendee) {
                        $attendeesWontGo[] = $eventAttendee;
                    }
                }
            }

            foreach ($attendeesWontGo as $eventAttendee) {
                $eventAttendee->wontGo = Carbon::now();
                $eventAttendee->standIn = null;
                $eventAttendee->signedIn = null;
                $eventAttendee->signedOut = null;
                if ($args['reason']) {
                    $eventAttendee->signedOutReason = clean($args['reason']);
                }

                $eventAttendee->save();
            }
        }

        if ($args['action'] === 'SIGN_OUT') {
            if (!$args['reason']) {
                return new \Exception('Dobrý pokus! Prosím napíš nám dôvod prečo sa nezúčastníš.');
            }

            $event = \App\NxEvent::findOrFail($args['eventId']);
            
            foreach ($args['terms'] as $termId) {
                $term = \App\NxEventTerm::findOrFail($termId);

                $attendeesToSignOut = [$attendee];
                if ($event->groupedEvents->count() > 0) {
                    foreach ($event->groupedEvents as $gEvent) {
                        $eventIds[] = $gEvent->id;
                        $eventAttendee = NxEventAttendee::where('userId', '=', $user->id)
                        ->whereHas('attendeesGroup', function ($query) use ($gEvent) {
                            $query->where('eventId', '=', $gEvent->id);
                        })->firstOrFail();

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
                    $signedTerms = $eventAttendee->terms()->wherePivot('signedIn', '!=', '')->wherePivot('signedIn', '!=', null)->count();
                    if (!$term || $signedTerms === 1) {
                        $eventAttendee->signedOut = Carbon::now();
                        $eventAttendee->signedOutReason = clean($args['reason']);
                        $eventAttendee->wontGo = null;
                        $eventAttendee->signedIn = null;
                        $eventAttendee->standIn = null;

                        foreach ($eventAttendee->terms as $attendeeTerm) {
                            $dataToSync = [];
                            $dataToSync[$attendeeTerm->id] = [
                                'signedOut' => Carbon::now(),
                                'signedOutReason' => clean($args['reason']),
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
                            'signedOutReason' => clean($args['reason']),
                            'wontGo' => null,
                            'signedIn' => null,
                            'standIn' => null,
                        ];
                        $eventAttendee->terms()->sync($dataToSync, false);
                    }
                    $eventAttendee->save();
                }

                if ($wasFull) {
                    event(new \App\Events\EventAttendeePlaceReleased($event));
                }
            }
        }

        return $attendee->fresh();
    }

}