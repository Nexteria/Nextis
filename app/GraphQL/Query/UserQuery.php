<?php

namespace App\GraphQL\Query;

use App\User;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class UserQuery extends Query
{
    protected $attributes = [
        'name' => 'User Query',
        'description' => 'A query of user'
    ];

    public function type()
    {
        return GraphQL::type('user');
    }
    
    // arguments to filter query
    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int()
            ],
        ];
    }

    public function resolve($root, $args, SelectFields $fields)
    {
        $where = function ($query) use ($args, $fields) {
            if (isset($args['id'])) {
                $query->where('id', $args['id']);
            }
        };

        $event = User::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->first();

        return $event;
    }
}
