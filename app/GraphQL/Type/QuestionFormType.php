<?php

namespace App\GraphQL\Type;

use App\AttendeesGroup;
use App\Models\QuestionForm\Form as QuestionForm;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class QuestionFormType extends GraphQLType
{
    protected $attributes = [
        'name' => 'QuestionForm',
        'description' => 'Question form for event',
        'model' => QuestionForm::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
                'description' => 'The id of the form'
            ],
        ];
    }
}
