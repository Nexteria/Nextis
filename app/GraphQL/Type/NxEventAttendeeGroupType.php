<?php

namespace App\GraphQL\Type;

use App\AttendeesGroup;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class NxEventAttendeeGroupType extends GraphQLType
{
    protected $attributes = [
        'name' => 'NxEventAttendeeGroup',
        'description' => 'Event attendee group type',
        'model' => AttendeesGroup::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the event'
            ],
            'maxCapacity' => [
                'type' => Type::int(),
                'description' => 'The max capacity for this group'
            ],
            'minCapacity' => [
                'type' => Type::int(),
                'description' => 'The min capacity for this group'
            ],
            'signUpOpenDateTime' => [
                'type' => Type::string(),
                'description' => 'Opening date time for sign up',
            ],
            'signUpDeadlineDateTime' => [
                'type' => Type::string(),
                'description' => 'Deadline for sign up',
            ],
            'eventId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the group`s event'
            ],
        ];
    }

    public function resolveSignUpOpenDateTimeField($root)
    {
        return (string) $root->signUpOpenDateTime;
    }

    public function resolveSignUpDeadlineDateTimeField($root)
    {
        return (string) $root->signUpDeadlineDateTime;
    }
}
