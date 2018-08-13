<?php

namespace App\GraphQL\Type;

use App\NxEventAttendee;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class NxEventAttendeeType extends GraphQLType
{
    protected $attributes = [
        'name' => 'NxEventAttendee',
        'description' => 'Event attendee type',
        'model' => NxEventAttendee::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the event'
            ],
            'wasPresent' => [
                'type' => Type::string(),
                'description' => 'The timestamp indicates when was presence maked for the event',
            ],
            'filledFeedback' => [
                'type' => Type::string(),
                'description' => 'The timestamp indicates when feedback was filled',
            ],
            'standIn' => [
                'type' => Type::string(),
                'description' => 'The datetime when attendee signed as standin',
            ],
            'signedIn' => [
                'type' => Type::string(),
                'description' => 'The datetime when attendee signed in',
            ],
            'signedOut' => [
                'type' => Type::string(),
                'description' => 'The datetime when attendee signed out',
            ],
            'wontGo' => [
                'type' => Type::string(),
                'description' => 'The datetime when attendee signed as wont go',
            ],
            'signedOutReason' => [
                'type' => Type::string(),
                'description' => 'The reason why attendee signed out',
            ],
            'signInOpenDateTime' => [
                'type' => Type::string(),
                'description' => 'The sign in opening date time attendee',
            ],
            'signInCloseDateTime' => [
                'type' => Type::string(),
                'description' => 'The sign in close date time for attendee',
            ],
            'userId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the user for the attendee'
            ],
            'attendeesGroupId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the sign in group for the event and attendee'
            ],
            'terms' => [
                'type' => Type::listOf(GraphQL::type('NxEventTerm')),
                'description' => 'The attendee`s terms',
                'always' => ['id'],
            ],
            'attendeesGroup' => [
                'type' => GraphQL::type('NxEventAttendeeGroup'),
                'description' => 'The attendee`s group',
                'always' => ['id'],
            ],
            'event' => [
                'type' => GraphQL::type('event'),
                'description' => 'Term`s event',
                'resolve' => function ($root, $args) {
                    return $root->event();
                },
                'selectable' => false,
            ]
        ];
    }

    public function resolveSignInOpenDateTimeField($root) {
        return (string) $root->signInOpenDateTime;
    }

    public function resolveSignInCloseDateTimeField($root) {
        return (string) $root->signInCloseDateTime;
    }

    public function resolveStandInField($root)
    {
        return (string) $root->standIn;
    }

    public function resolveSignedInField($root)
    {
        return (string) $root->signedIn;
    }

    public function resolveSignedOutField($root)
    {
        return (string) $root->signedOut;
    }

    public function resolveWontGoField($root)
    {
        return (string) $root->wontGo;
    }

    public function resolveFilledFeedbackField($root)
    {
        return (string) $root->filledFeedback;
    }

    public function resolveWasPresentField($root)
    {
        return (string) $root->wasPresent;
    }
}
