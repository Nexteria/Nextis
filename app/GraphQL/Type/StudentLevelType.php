<?php

namespace App\GraphQL\Type;

use App\User;
use App\StudentLevel;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class StudentLevelType extends GraphQLType
{
    protected $attributes = [
        'name' => 'studentLevel',
        'description' => 'Student level type',
        'model' => StudentLevel::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the level'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'The name of the level',
            ],
            'codename' => [
                'type' => Type::string(),
                'description' => 'The codename of the level',
            ],
            'user_group_id' => [
                'type' => Type::int(),
                'description' => 'The level`s associated user group id',
            ],
            'defaultTuitionFee' => [
                'type' => Type::int(),
                'description' => 'The level`s default tuition fee',
            ],
            'defaultActivityPointsBaseNumber' => [
                'type' => Type::int(),
                'description' => 'The level`s default base activity points number',
            ],
            'defaultMinimumSemesterActivityPoints' => [
                'type' => Type::int(),
                'description' => 'The level`s default minimum activity points number',
            ],
        ];
    }
}
