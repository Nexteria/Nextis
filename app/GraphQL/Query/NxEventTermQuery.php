<?php

namespace App\GraphQL\Query;

use App\NxEventTerm;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class NxEventTermQuery extends Query
{
    protected $attributes = [
        'name' => 'Term Query',
        'description' => 'A query of term'
    ];

    public function type()
    {
        return GraphQL::type('NxEventTerm');
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

        $term = NxEventTerm::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->first();

        return $term;
    }
}
