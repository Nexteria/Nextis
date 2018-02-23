<?php

namespace App\GraphQL\Type;

use App\NxEventTerm;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class TermAttendingNumbers extends GraphQLType
{
    protected $attributes = [
        'name' => 'TermAttendingNumbers',
        'description' => 'Attending numbers for the term',
    ];

    public function fields()
    {
        return [
            'signedIn' => [
                'type' => Type::int(),
                'description' => 'The amount of signed in students',
                'selectable' => false,
            ],
            'standIn' => [
                'type' => Type::int(),
                'description' => 'The amount of standin students',
                'selectable' => false,
            ],
            'invited' => [
                'type' => Type::int(),
                'description' => 'The amount of invited students',
                'selectable' => false,
            ],
        ];
    }
}
