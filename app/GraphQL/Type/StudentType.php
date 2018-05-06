<?php

namespace App\GraphQL\Type;

use App\User;
use App\Student;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class StudentType extends GraphQLType
{
    protected $attributes = [
        'name' => 'student',
        'description' => 'Student type',
        'model' => Student::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the student'
            ],
            'userId' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the user associated with the user',
            ],
            'firstName' => [
                'type' => Type::string(),
                'description' => 'The first name of the student',
            ],
            'lastName' => [
                'type' => Type::string(),
                'description' => 'The last name of the student',
            ],
            'tuitionFee' => [
                'type' => Type::int(),
                'description' => 'The student`s tuition fee',
                'args' => [
                    'semesterId' => [
                        'type' => Type::int(),
                        'name' => 'semesterId',
                    ]
                ],
                'resolve' => function ($root, $args) {
                    $semesterId = \App\DefaultSystemSettings::get('activeSemesterId');

                    if (isset($args['semesterId'])) {
                        $semesterId = $args['semesterId'];
                    }

                    $studentSemester = $root->semesters()->where('semesterId', $semesterId)->first();

                    return $studentSemester->pivot->tuitionFee;
                },
            ],
            'activityPoints' => [
                'type' => GraphQL::type('activityPoints'),
                'description' => 'The student`s activity points',
                'args' => [
                    'semesterId' => [
                        'type' => Type::int(),
                        'name' => 'semesterId',
                    ]
                ],
                'resolve' => function ($root, $args) {
                    $semesterId = \App\DefaultSystemSettings::get('activeSemesterId');

                    if (isset($args['semesterId'])) {
                        $semesterId = $args['semesterId'];
                    }

                    $studentSemester = $root->semesters()->where('semesterId', $semesterId)->first();
                    $computedPoints = $root->user->computeActivityPoints($semesterId);

                    return [
                        'gained' => $root->activityPoints()->where('semesterId', $semesterId)->sum('gainedPoints'),
                        'minimum' => $studentSemester->pivot->minimumSemesterActivityPoints,
                        'base' => $studentSemester->pivot->activityPointsBaseNumber,
                        ''
                    ];
                },
            ],
            'meetings' => [
                'type' => Type::listOf(GraphQL::type('NxEventTerm')),
                'description' => 'The student`s future terms where he is signed in',
                'resolve' => function ($root, $args) {
                    return $root->getMeetings();
                },
                'selectable' => false,
            ],
            'openEventsForSignin' => [
                'type' => Type::listOf(GraphQL::type('event')),
                'description' => 'The student`s events, where the sign in is open.',
                'resolve' => function ($root, $args) {
                    return $root->getOpenEventsForSignin();
                },
                'selectable' => false,
            ],
            'termsForFeedback' => [
                'type' => Type::listOf(GraphQL::type('NxEventTerm')),
                'description' => 'The student`s terms waiting for feedback.',
                'resolve' => function ($root, $args) {
                    return $root->getTermsWaitingForFeedback();
                },
                'selectable' => false,
            ]
        ];
    }
}
