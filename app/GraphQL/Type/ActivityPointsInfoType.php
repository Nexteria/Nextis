<?php

namespace App\GraphQL\Type;

use App\NxEventTerm;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class ActivityPointsInfoType extends GraphQLType
{
    protected $attributes = [
        'name' => 'activityPointsInfo',
        'description' => 'Activity points info',
    ];

    public function fields()
    {
        return [
            'gained' => [
                'type' => Type::int(),
                'description' => 'The amount of points which student already gained',
                'selectable' => false,
            ],
            'base' => [
                'type' => Type::int(),
                'description' => 'The base amount of points for student',
                'selectable' => false,
            ],
            'minimum' => [
                'type' => Type::int(),
                'description' => 'The minimum amount of points needed for student to pass semester',
                'selectable' => false,
            ],
        ];
    }
}
