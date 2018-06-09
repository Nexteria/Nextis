<?php

namespace App\GraphQL\Query;

use App\User;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class UsersQuery extends Query
{
    protected $attributes = [
        'name' => 'Users Query',
        'description' => 'Query users'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('user'));
    }

    public function args()
    {
        return [
            'skill_ids' => [
                'name' => 'skill_ids',
                'type' => Type::listof(Type::int()),
                'rules' => ['array'],
            ],
            'status' => [
                'name' => 'status',
                'type' => Type::string()
            ],
        ];
    }

    public function resolve($root, $args, SelectFields $fields)
    {
        $where = function ($query) use ($args, $fields) {
            if (isset($args['skill_ids'])) {
                $query->whereHas('skills', function ($skillsQuery) use ($args) {
                    $skillsQuery->whereIn('id', $args['skill_ids']);
                });
            }

            if (isset($args['status'])) {
                $query->where('status', $args['status']);
            }
        };

        $users = User::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->get();

        return $users;
    }
}
