<?php

namespace App\GraphQL\Type;

use App\NxEventTerm;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class ActivityPointsType extends GraphQLType
{
    protected $attributes = [
        'name' => 'activityPoints',
        'description' => 'Activity points records',
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::int(),
                'description' => 'The id of points',
                'selectable' => false,
            ],
            'gainedPoints' => [
                'type' => Type::int(),
                'description' => 'The amount of points which student gained',
                'selectable' => false,
            ],
            'maxPossiblePoints' => [
                'type' => Type::int(),
                'description' => 'The maximum of points which student could get',
                'selectable' => false,
            ],
            'studentId' => [
                'type' => Type::int(),
                'description' => 'The id of the student which points belongs to',
                'selectable' => false,
            ],
            'semesterId' => [
                'type' => Type::int(),
                'description' => 'The id of semester in which are points valid',
                'selectable' => false,
            ],
            'activityName' => [
                'type' => Type::string(),
                'description' => 'The name of the activity for which was points granted',
                'selectable' => false,
            ],
            'activityType' => [
                'type' => Type::string(),
                'description' => 'The type of the activity for which was points granted',
                'selectable' => false,
            ],
            'activityModelId' => [
                'type' => Type::int(),
                'description' => 'The id of activity object model',
                'selectable' => false,
            ],
            'note' => [
                'type' => Type::string(),
                'description' => 'The note connected to the points',
                'selectable' => false,
            ],
            'addedByUserId' => [
                'type' => Type::int(),
                'description' => 'The of used who granted points',
                'selectable' => false,
            ],
            'created_at' => [
                'type' => Type::string(),
                'description' => 'The datetime of when the points was created',
                'selectable' => false,
            ],
            'updated_at' => [
                'type' => Type::string(),
                'description' => 'The datetime of when the points was last time updated',
                'selectable' => false,
            ],
        ];
    }

    public function resolveCreatedAtField($root)
    {
        return (string) $root->created_at;
    }

    public function resolveUpdatedAtField($root)
    {
        return (string) $root->updated_at;
    }
}
