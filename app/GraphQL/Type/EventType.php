<?php

namespace App\GraphQL\Type;

use App\NxEvent;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class EventType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Event',
        'description' => 'Event type',
        'model' => NxEvent::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the event'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'The name of the event',
            ],
            'eventType' => [
                'type' => Type::string(),
                'description' => 'The type of the event (ik, dbk, other...)',
            ],
            'status' => [
                'type' => Type::string(),
                'description' => 'The status of the event',
            ],
            'curriculumLevelId' => [
                'type' => Type::int(),
                'description' => 'The id of the event`s level',
            ],
            'semesterId' => [
                'type' => Type::int(),
                'description' => 'The id of the event`s semester',
            ],
            'hasSignInQuestionaire' => [
                'type' => Type::boolean(),
                'description' => 'If the user has to fill questionaire during SignIn',
                'selectable' => false,
            ],
            'groupedEvents' => [
                'type' => Type::listOf(GraphQL::type('event')),
                'description' => 'The grouped events with this event',
            ],
            'form' => [
                'type' => GraphQL::type('QuestionForm'),
                'description' => 'Question form for this event',
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
                        return $root->attendees()->where('nx_event_attendees.userId', $args['userId'])->get();
                    }

                    return $root->attendees;
                },
                'always' => ['id'],
            ],
            'terms' => [
                'type' => Type::listOf(GraphQL::type('NxEventTerm')),
                'description' => 'The event`s terms',
                'args' => [
                    'from' => [
                        'type' => Type::string(),
                        'name' => 'from',
                    ],
                    'to' => [
                        'type' => Type::string(),
                        'name' => 'to',
                    ]
                ],
                'resolve' => function ($root, $args) {
                    $query = $root->terms();

                    if (isset($args['from'])) {
                        \Log::error('from');
                        $query = $query->whereRaw('nx_event_terms.eventStartDateTime >= "'.$args['from'].'"');
                    }

                    if (isset($args['to'])) {
                        \Log::error('to');
                        $query = $query->whereRaw('nx_event_terms.eventStartDateTime <= "'.$args['to'].'"');
                    }

                    return $query->get();
                },
                'always' => ['id'],
            ],
        ];
    }
}
