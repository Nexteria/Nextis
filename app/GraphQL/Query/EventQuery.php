<?php

namespace App\GraphQL\Query;

use App\NxEvent;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class EventQuery extends Query
{
    protected $attributes = [
        'name' => 'Event Query',
        'description' => 'A query of event'
    ];

    public function type()
    {
        return GraphQL::type('event');
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

        $event = NxEvent::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->first();

        return $event;
    }
}
