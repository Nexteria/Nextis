<?php

namespace App\GraphQL\Type;

use App\NxEventAttendee;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class NxTermAttendeeType extends GraphQLType
{
    protected $attributes = [
        'name' => 'NxTermAttendee',
        'description' => 'Term attendee type',
        'model' => NxEventAttendee::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the intermediate table record',
                'resolve' => function ($root) {
                    return $root->pivot->id;
                },
                'selectable' => false,
            ],
            'attendeeId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the attendee',
                'resolve' => function ($root) {
                    return $root->id;
                },
                'selectable' => false,
            ],
            'wasPresent' => [
                'type' => Type::string(),
                'description' => 'The timestamp indicates when was presence maked for the event',
                'resolve' => function ($root) {
                    return (string) $root->pivot->wasPresent;
                },
                'selectable' => false,
            ],
            'filledFeedback' => [
                'type' => Type::string(),
                'description' => 'The timestamp indicates when feedback was filled',
                'resolve' => function ($root) {
                    return (string) $root->pivot->filledFeedback;
                },
                'selectable' => false,
            ],
            'feedbackDeadlineAt' => [
                'type' => Type::string(),
                'description' => 'The timestamp indicates when the deadline for filling feedback is',
                'resolve' => function ($root) {
                    return (string) $root->pivot->feedbackDeadlineAt;
                },
                'selectable' => false,
            ],
            'standIn' => [
                'type' => Type::string(),
                'description' => 'The datetime when attendee signed as standin',
                'resolve' => function ($root) {
                    return (string) $root->pivot->standIn;
                },
                'selectable' => false,
            ],
            'signedIn' => [
                'type' => Type::string(),
                'description' => 'The datetime when attendee signed in',
                'resolve' => function ($root) {
                    return (string) $root->pivot->signedIn;
                },
                'selectable' => false,
            ],
            'signedOut' => [
                'type' => Type::string(),
                'description' => 'The datetime when attendee signed out',
                'resolve' => function ($root) {
                    return (string) $root->pivot->signedOut;
                },
                'selectable' => false,
            ],
            'wontGo' => [
                'type' => Type::string(),
                'description' => 'The datetime when attendee signed as wont go',
                'resolve' => function ($root) {
                    return (string) $root->pivot->wontGo;
                },
                'selectable' => false,
            ],
            'signedOutReason' => [
                'type' => Type::string(),
                'description' => 'The reason why attendee signed out',
                'resolve' => function ($root) {
                    return (string) $root->pivot->signedOutReason;
                },
                'selectable' => false,
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
            'user' => [
                'type' => GraphQL::type('user'),
                'description' => 'The attendee`s user',
            ],
            'attendeesGroupId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the sign in group for the event and attendee'
            ],
            'term' => [
                'type' => GraphQL::type('NxEventTerm'),
                'description' => 'The attendee`s term',
                'resolve' => function ($root) {
                    return (string) $root->terms()->where('id', $root->pivot->termId)->first();
                },
                'selectable' => false,
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

    public function resolveSignedInField($root)
    {
        return (string) $root->pivot->signedIn;
    }

    public function resolveSignedOutField($root)
    {
        return (string) $root->pivot->signedOut;
    }

    public function resolveWontGoField($root)
    {
        return (string) $root->pivot->wontGo;
    }

    public function resolveFilledFeedbackField($root)
    {
        return (string) $root->pivot->filledFeedback;
    }

    public function resolveWasPresentField($root)
    {
        return (string) $root->pivot->wasPresent;
    }
    
    public function resolveFeedbackDeadlineAtField($root)
    {
        return (string) $root->pivot->feedbackDeadlineAt;
    }
}
