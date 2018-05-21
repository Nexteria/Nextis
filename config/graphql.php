<?php

use App\GraphQL\Type\EventType;
use App\GraphQL\Type\NxEventTermType;
use App\GraphQL\Type\NxEventAttendeeType;
use App\GraphQL\Type\NxEventAttendeeGroupType;
use App\GraphQL\Type\NxLocationType;
use App\GraphQL\Type\TermAttendingNumbers;
use App\GraphQL\Type\UserType;
use App\GraphQL\Type\StudentType;
use App\GraphQL\Type\StudentLevelType;
use App\GraphQL\Type\ActivityPointsInfoType;
use App\GraphQL\Type\ActivityPointsType;
use App\GraphQL\Type\QuestionFormType;
use App\GraphQL\Type\SemesterType;
use App\GraphQL\Type\PaymentType;
use App\GraphQL\Type\PaymentCategoryType;
use App\GraphQL\Type\ImageType;

use App\GraphQL\Query\EventsQuery;
use App\GraphQL\Query\EventQuery;
use App\GraphQL\Query\UserQuery;
use App\GraphQL\Query\StudentQuery;
use App\GraphQL\Query\StudentsQuery;

use App\GraphQL\Mutations\UserProfileMutation;
use App\GraphQL\Mutations\UserProfilePhotoMutation;

return [
    'prefix' => 'graphql',
    'routes' => '{graphql_schema?}',
    'controllers' => \App\Http\Controllers\GraphQLController::class . '@query',
    'middleware' => ['web', 'auth'],
    'default_schema' => 'default',

    'schemas' => [
        'default' => [
            'query' => [
                'events' => EventsQuery::class,
                'event' => EventQuery::class,
                'user' => UserQuery::class,
                'student' => StudentQuery::class,
                'students' => StudentsQuery::class,
            ],
            'mutation' => [
                'UpdateUserProfile' => UserProfileMutation::class,
                'UpdateUserProfilePhoto' => UserProfilePhotoMutation::class,
            ],
            'middleware' => ['auth']
        ],
    ],

    'types' => [
        'event' => EventType::class,
        'NxEventTerm' => NxEventTermType::class,
        'NxEventAttendee' => NxEventAttendeeType::class,
        'NxEventAttendeeGroup' => NxEventAttendeeGroupType::class,
        'QuestionForm' => QuestionFormType::class,
        'TermAttendingNumbers' => TermAttendingNumbers::class,
        'NxLocation' => NxLocationType::class,
        'user' => UserType::class,
        'student' => StudentType::class,
        'studentLevel' => StudentLevelType::class,
        'activityPointsInfo' => ActivityPointsInfoType::class,
        'activityPoints' => ActivityPointsType::class,
        'semester' => SemesterType::class,
        'payment' => PaymentType::class,
        'paymentCategory' => PaymentCategoryType::class,
        'image' => ImageType::class,
    ],

    'error_formatter' => ['\Rebing\GraphQL\GraphQL', 'formatError'],
    'params_key'    => 'variables',
];
