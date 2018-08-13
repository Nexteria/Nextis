<?php

namespace App\GraphQL\Type\QuestionForm;

use App\AttendeesGroup;
use App\Models\QuestionForm\Form as QuestionForm;
use App\Models\QuestionForm\FormDescription as QuestionFormDescription;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class DescriptionType extends GraphQLType
{
    protected $attributes = [
        'name' => 'QuestionFormDescription',
        'description' => 'Question form description for event',
        'model' => QuestionFormDescription::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the form description'
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'The description for the form'
            ],
            'attendeeGroupId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the attndees group which this description is for',
            ]
        ];
    }
}
