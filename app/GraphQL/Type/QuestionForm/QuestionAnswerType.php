<?php

namespace App\GraphQL\Type\QuestionForm;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class QuestionAnswerType extends GraphQLType
{
    protected $inputObject = true;

    protected $attributes = [
        'name' => 'QuestionAnswer',
        'description' => 'Question answer',
    ];

    public function fields()
    {
        return [
            'questionId' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The id of the question which this answer is for'
            ],
            'answer' => [
                'type' => Type::listOf(Type::string()),
                'description' => 'The array of choices / answers for the question'
            ],
        ];
    }
}
