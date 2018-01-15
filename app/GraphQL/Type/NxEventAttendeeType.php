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
                'type' => Type::boolean(),
                'description' => 'The flag indicates if attendee was present on event',
            ],
            'filledFeedback' => [
                'type' => Type::boolean(),
                'description' => 'The flag indicates if attendee filled feedback for event',
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
        ];
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
}
