<?php

namespace App\GraphQL\Type\QuestionForm;

use App\Models\QuestionForm\Choice;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class QuestionChoiceType extends GraphQLType
{
    protected $attributes = [
        'name' => 'QuestionChoice',
        'description' => 'Choice in question',
        'model' => Choice::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The uuid of the question'
            ],
            'title' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The title of the choice',
            ],
            'order' => [
                'type' => Type::int(),
                'description' => 'Order of the question in the form',
            ],
        ];
    }
}
