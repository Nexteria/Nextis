<?php

namespace App\GraphQL\Query;

use App\NxLocation;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class LocationsQuery extends Query
{
    protected $attributes = [
        'name' => 'Locations Query',
        'description' => 'A query of locations'
    ];

    public function type()
    {
        // result of query with pagination laravel
        return Type::listOf(GraphQL::type('NxLocation'));
    }
    
    // arguments to filter query
    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int()
            ],
            'withDeleted' => [
                'name' => 'withDeleted',
                'type' => Type::boolean()
            ],
        ];
    }

    public function resolve($root, $args, SelectFields $fields)
    {
        $where = function ($query) use ($args, $fields) {
            if (isset($args['withDeleted']) && $args['withDeleted']) {
                $query->withTrashed();
            }
            if (isset($args['id'])) {
                $query->where('id', $args['id']);
            }
        };

        $locations = NxLocation::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->get();

        return $locations;
    }
}
