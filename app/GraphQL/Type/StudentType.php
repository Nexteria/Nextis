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
            'startingYear' => [
                'type' => Type::int(),
                'description' => 'The year where student start study in Nexteria',
            ],
            'endYear' => [
                'type' => Type::int(),
                'description' => 'The year where student ends study in Nexteria',
            ],
            'user' => [
                'type' => GraphQL::type('user'),
                'description' => 'User associated with this student',
            ],
            'tuitionFeeVariableSymbol' => [
                'type' => Type::string(),
                'description' => 'The variable symbol for student tuition payments',
            ],
            'status' => [
                'type' => Type::string(),
                'description' => 'The student status',
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

                    return $studentSemester ? $studentSemester->pivot->tuitionFee : null;
                },
            ],
            'level' => [
                'type' => GraphQL::type('studentLevel'),
                'description' => 'The student`s level',
            ],
            'semesters' => [
                'type' => Type::listOf(GraphQL::type('semester')),
                'description' => 'The student`s semesters',
            ],
            'activeSemester' => [
                'type' => GraphQL::type('semester'),
                'description' => 'The student`s active semester',
                'resolve' => function ($root, $args) {
                    return $root->getActiveSemester();
                },
                'selectable' => false,
            ],
            'activityPointsInfo' => [
                'type' => GraphQL::type('activityPointsInfo'),
                'description' => 'The student`s activity points info',
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

                    return [
                        'gained' => $root->activityPoints()->where('semesterId', $semesterId)->sum('gainedPoints'),
                        'minimum' => $studentSemester ? $studentSemester->pivot->minimumSemesterActivityPoints : null,
                        'base' => $studentSemester ? $studentSemester->pivot->activityPointsBaseNumber : null,
                    ];
                },
                'selectable' => false,
            ],
            'activityPoints' => [
                'type' => Type::listOf(GraphQL::type('activityPoints')),
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

                    return $root->activityPoints()->where('semesterId', $semesterId)->get();
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
                'args' => [
                    'signedIn' => [
                        'type' => Type::boolean(),
                        'name' => 'signedIn',
                    ],
                    'semesterId' => [
                        'type' => Type::int(),
                        'name' => 'semesterId',
                    ],
                ],
                'resolve' => function ($root, $args) {
                    $filters = [];
                    if (isset($args['signedIn'])) {
                        $filters['signedIn'] = $args['signedIn'];
                    }
                    if (isset($args['semesterId'])) {
                        $filters['semesterId'] = $args['semesterId'];
                    }

                    return $root->getOpenEventsForSignin($filters);
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
            ],
            'unfinishedEvents' => [
                'type' => Type::listOf(GraphQL::type('event')),
                'description' => 'The student`s events, where he is signed in and event is not over yet.',
                'args' => [
                    'semesterId' => [
                        'type' => Type::int(),
                        'name' => 'semesterId',
                    ]
                ],
                'resolve' => function ($root, $args) {
                    $filters = [];
                    if (isset($args['semesterId'])) {
                        $filters['semesterId'] = $args['semesterId'];
                    }

                    return $root->unfinishedEvents($filters);
                },
                'selectable' => false,
            ],
        ];
    }
}
