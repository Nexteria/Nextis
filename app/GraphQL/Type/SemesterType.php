<?php

namespace App\GraphQL\Type;

use App\User;
use App\Semester;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class SemesterType extends GraphQLType
{
    protected $attributes = [
        'name' => 'semester',
        'description' => 'Semester type',
        'model' => Semester::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the semester'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'The name of the semester',
            ],
            'startDate' => [
                'type' => Type::string(),
                'description' => 'The starting date for semester',
            ],
            'endDate' => [
                'type' => Type::string(),
                'description' => 'The ending date for semester',
            ],
        ];
    }
}
