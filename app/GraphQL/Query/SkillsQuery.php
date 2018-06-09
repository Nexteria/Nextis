<?php

namespace App\GraphQL\Query;

use App\Skill;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class SkillsQuery extends Query
{
    protected $attributes = [
        'name' => 'Skills Query',
        'description' => 'A query of skills'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('skill'));
    }
    
    public function args()
    {
        return [
            'status' => [
                'name' => 'status',
                'type' => Type::string()
            ],
        ];
    }

    public function resolve($root, $args, SelectFields $fields)
    {
        $where = function ($query) use ($args, $fields) {
            if (isset($args['status'])) {
                $query->where('status', $args['status']);
            }
        };

        $skill = Skill::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->get();

        return $skill;
    }
}
