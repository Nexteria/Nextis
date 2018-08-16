<?php

namespace App\GraphQL\Query;

use App\StudentLevel;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class StudentLevelsQuery extends Query
{
    protected $attributes = [
        'name' => 'Student levels Query',
        'description' => 'A query of student levels'
    ];

    public function type()
    {
        // result of query with pagination laravel
        return Type::listOf(GraphQL::type('studentLevel'));
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

        $semester = StudentLevel::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->get();

        return $semester;
    }
}
