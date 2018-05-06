<?php

namespace App\GraphQL\Query;

use App\Student;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class StudentQuery extends Query
{
    protected $attributes = [
        'name' => 'Student Query',
        'description' => 'A query of student'
    ];

    public function type()
    {
        return GraphQL::type('student');
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

        $student = Student::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->first();

        return $student;
    }
}
