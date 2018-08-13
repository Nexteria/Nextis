<?php

namespace App\GraphQL\Type\QuestionForm;

use App\Models\QuestionForm\Question;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class QuestionType extends GraphQLType
{
    protected $attributes = [
        'name' => 'QuestionFormQuestion',
        'description' => 'Question in question form',
        'model' => Question::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The uuid of the question'
            ],
            'question' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The text of the question',
            ],
            'dependencies' => [
                'type' => Type::listOf(GraphQL::type('QuestionChoice')),
                'description' => 'The dependencies for showing of this question',
            ],
            'choices' => [
                'type' => Type::listOf(GraphQL::type('QuestionChoice')),
                'description' => 'The choices for  this question',
            ],
            'type' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'Question type',
            ],
            'required' => [
                'type' => Type::nonNull(Type::boolean()),
                'description' => 'If the answer is required',
            ],
            'order' => [
                'type' => Type::int(),
                'description' => 'Order of the question in the form',
            ],
            'minSelection' => [
                'type' => Type::int(),
                'description' => 'How many options must be selected at minimum',
            ],
            'maxSelection' => [
                'type' => Type::int(),
                'description' => 'How many options must be selected at maximum',
            ],
        ];
    }
}
