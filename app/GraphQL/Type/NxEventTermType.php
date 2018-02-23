<?php

namespace App\GraphQL\Type;

use App\NxEventTerm;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class NxEventTermType extends GraphQLType
{
    protected $attributes = [
        'name' => 'NxEventTerm',
        'description' => 'Event term type',
        'model' => NxEventTerm::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the event'
            ],
            'eventId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the term`s event',
            ],
            'userId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the user who created term',
            ],
            'hostId' => [
                'type' => Type::int(),
                'description' => 'The id of the user who is host for term',
            ],
            'parentTermId' => [
                'type' => Type::int(),
                'description' => 'The id of the parent term',
            ],
            'minCapacity' => [
                'type' => Type::int(),
                'description' => 'The minimum capacity of the term',
            ],
            'maxCapacity' => [
                'type' => Type::int(),
                'description' => 'The maximum capacity of the term',
            ],
            'nxLocationId' => [
                'type' => Type::int(),
                'description' => 'The id of the term`s location',
            ],
            'feedbackLink' => [
                'type' => Type::string(),
                'description' => 'The feedback link with edit privilages',
            ],
            'publicFeedbackLink' => [
                'type' => Type::string(),
                'description' => 'The public feedback link',
            ],
            'eventStartDateTime' => [
                'type' => Type::string(),
                'description' => 'The start datetime of the term',
            ],
            'eventEndDateTime' => [
                'type' => Type::string(),
                'description' => 'The end datetime of the term',
            ],
            'location' => [
                'type' => GraphQL::type('NxLocation'),
                'description' => 'Term location',
            ],
            'canNotSignInReason' => [
                'type' => Type::string(),
                'description' => 'If the user can sign in',
                'args' => [
                    'userId' => [
                        'type' => Type::int(),
                        'name' => 'userId',
                    ]
                ],
                'resolve' => function ($root, $args) {
                    if (isset($args['userId'])) {
                        $attendee = $root->attendees()->where('userId', $args['userId'])->first();
                        if (!$attendee) {
                            return 'user_not_invited';
                        }
                        return $root->event->canSignInAttendee($attendee, $root->id)['codename'];
                    }

                    return 'user_not_specified';
                },
                'selectable' => false,
            ],
            'attendingNumbers' => [
                'type' => GraphQL::type('TermAttendingNumbers'),
                'description' => 'Attending number for term',
                'resolve' => function ($root, $args) {
                    return [
                        'signedIn' => $root->attendees()->wherePivot('signedIn', '!=', 'null')->count(),
                        'standIn' => $root->attendees()->wherePivot('standIn', '!=', 'null')->count(),
                        'invited' => $root->attendees()->count()
                    ];
                },
                'selectable' => false,
            ],
            'attendees' => [
                'type' => Type::listOf(GraphQL::type('NxEventAttendee')),
                'description' => 'The event`s attendees',
                'args' => [
                    'userId' => [
                        'type' => Type::int(),
                        'name' => 'userId',
                    ]
                ],
                'resolve' => function ($root, $args) {
                    if (isset($args['userId'])) {
                        return $root->attendees()->where('userId', $args['userId'])->get();
                    }

                    return $root->attendees()->get();
                },
                'always' => ['id'],
            ],
        ];
    }

    public function resolveEventStartDateTimeField($root)
    {
        return (string) $root->eventStartDateTime;
    }

    public function resolveEventEndDateTimeField($root)
    {
        return (string) $root->eventEndDateTime;
    }
}
