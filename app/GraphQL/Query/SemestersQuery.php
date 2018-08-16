<?php

namespace App\GraphQL\Query;

use App\Semester;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class SemestersQuery extends Query
{
    protected $attributes = [
        'name' => 'Semesters Query',
        'description' => 'A query of semesters'
    ];

    public function type()
    {
        // result of query with pagination laravel
        return Type::listOf(GraphQL::type('semester'));
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

        $semester = Semester::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->get();

        return $semester;
    }
}
