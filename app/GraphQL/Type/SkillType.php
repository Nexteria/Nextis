<?php

namespace App\GraphQL\Type;

use App\Skill;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;

class SkillType extends GraphQLType
{
    protected $attributes = [
        'name' => 'skill',
        'description' => 'User skill',
        'model' => Skill::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::int(),
                'description' => 'Skill id'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'Skill name',
            ],
            'users' => [
                'type' => Type::listOf(GraphQL::type('user')),
                'description' => 'Users which has this skill',
            ],
            'status' => [
                'type' => Type::string(),
                'description' => 'Skill status',
            ]
        ];
    }
}
