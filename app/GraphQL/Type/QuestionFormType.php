<?php

namespace App\GraphQL\Type;

use App\AttendeesGroup;
use App\NxEventAttendee;
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
            'name' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The name of the form'
            ],
            'description' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The default description of the form'
            ],
            'descriptions' => [
                'type' => Type::listOf(GraphQL::type('QuestionFormDescription')),
                'description' => 'The description for this form',
                'args' => [
                    'userId' => [
                        'type' => Type::int(),
                        'name' => 'userId',
                    ],
                ],
                'resolve' => function ($root, $args) {
                    $user = \Auth::user();
                    $groupIds = NxEventAttendee::where('userId', $user->id)->pluck('attendeesGroupId');
                    $descriptions = $root->descriptions($args['userId'])->whereIn('attendeeGroupId', $groupIds);

                    return $descriptions->get();
                },
            ],
            'questions' => [
                'type' => Type::listOf(GraphQL::type('QuestionFormQuestion')),
                'description' => 'Questions for this form',
                'args' => [
                    'userId' => [
                        'type' => Type::int(),
                        'name' => 'userId',
                    ],
                ],
                'resolve' => function ($root, $args) {
                    $user = \Auth::user();
                    $groupIds = NxEventAttendee::where('userId', $user->id)->pluck('attendeesGroupId');
                    $questions = $root->questions()->whereHas('attendeesGroups', function ($query) use ($groupIds) {
                        $query->whereIn('attendeeGroupId', $groupIds);
                    })->get();

                    if (count($questions) === 0) {
                        $questions = $root->questions()->whereDoesntHave('attendeesGroups')->get();
                    }
                    

                    return $questions;
                },
            ],
            'answeredByUser' => [
                'type' => Type::nonNull(Type::boolean()),
                'description' => 'Indicates if the user filled up form already',
                'selectable' => false,
                'args' => [
                    'userId' => [
                        'type' => Type::int(),
                        'name' => 'userId',
                    ],
                ],
                'resolve' => function ($root, $args) {
                    $answers = $root->getUsersAnswers($args['userId']);

                    return count($answers) > 0;
                },
            ]
        ];
    }
}
