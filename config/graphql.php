<?php

use App\GraphQL\Type\EventType;
use App\GraphQL\Type\NxEventTermType;
use App\GraphQL\Type\NxTermAttendeeType;
use App\GraphQL\Type\NxEventAttendeeType;
use App\GraphQL\Type\NxEventAttendeeGroupType;
use App\GraphQL\Type\NxLocationType;
use App\GraphQL\Type\TermAttendingNumbers;
use App\GraphQL\Type\SigninCheckType;
use App\GraphQL\Type\UserType;
use App\GraphQL\Type\StudentType;
use App\GraphQL\Type\StudentLevelType;
use App\GraphQL\Type\ActivityPointsInfoType;
use App\GraphQL\Type\ActivityPointsType;
use App\GraphQL\Type\QuestionFormType;
use App\GraphQL\Type\QuestionForm\DescriptionType as QuestionFormDescriptionType;
use App\GraphQL\Type\QuestionForm\QuestionType;
use App\GraphQL\Type\QuestionForm\QuestionChoiceType;
use App\GraphQL\Type\QuestionForm\QuestionAnswerType;
use App\GraphQL\Type\SemesterType;
use App\GraphQL\Type\PaymentType;
use App\GraphQL\Type\PaymentCategoryType;
use App\GraphQL\Type\ImageType;
use App\GraphQL\Type\SkillType;

use App\GraphQL\Query\EventsQuery;
use App\GraphQL\Query\EventQuery;
use App\GraphQL\Query\LocationsQuery;
use App\GraphQL\Query\UserQuery;
use App\GraphQL\Query\UsersQuery;
use App\GraphQL\Query\StudentQuery;
use App\GraphQL\Query\StudentsQuery;
use App\GraphQL\Query\SkillsQuery;
use App\GraphQL\Query\SemestersQuery;
use App\GraphQL\Query\StudentLevelsQuery;

use App\GraphQL\Mutations\CreateSkillMutation;
use App\GraphQL\Mutations\UserProfileMutation;
use App\GraphQL\Mutations\UserProfilePhotoMutation;
use App\GraphQL\Mutations\StandInSignActionMutation;
use App\GraphQL\Mutations\SubmitQuestionaireMutation;
use App\GraphQL\Mutations\EventSignActionMutation;
use App\GraphQL\Mutations\LocationMutation;
use App\GraphQL\Mutations\DeleteLocationMutation;


return [
    'prefix' => 'graphql',
    'routes' => '{graphql_schema?}',
    'controllers' => \Rebing\GraphQL\GraphQLController::class . '@query',
    'middleware' => ['web', 'auth'],
    'default_schema' => 'default',

    'schemas' => [
        'default' => [
            'query' => [
                'events' => EventsQuery::class,
                'event' => EventQuery::class,
                'user' => UserQuery::class,
                'users' => UsersQuery::class,
                'student' => StudentQuery::class,
                'students' => StudentsQuery::class,
                'skills' => SkillsQuery::class,
                'semesters' => SemestersQuery::class,
                'studentLevels' => StudentLevelsQuery::class,
                'locations' => LocationsQuery::class,
            ],
            'mutation' => [
                'UpdateUserProfile' => UserProfileMutation::class,
                'StandInSignAction' => StandInSignActionMutation::class,
                'UpdateUserProfilePhoto' => UserProfilePhotoMutation::class,
                'CreateSkill' => CreateSkillMutation::class,
                'SubmitQuestionaire' => SubmitQuestionaireMutation::class,
                'EventSignAction' => EventSignActionMutation::class,
                'UpdateLocation' => LocationMutation::class,
                'DeleteLocation' => DeleteLocationMutation::class,
            ],
            'middleware' => ['auth']
        ],
    ],

    'types' => [
        'event' => EventType::class,
        'NxEventTerm' => NxEventTermType::class,
        'NxTermAttendee' => NxTermAttendeeType::class,
        'NxEventAttendee' => NxEventAttendeeType::class,
        'NxEventAttendeeGroup' => NxEventAttendeeGroupType::class,
        'QuestionForm' => QuestionFormType::class,
        'QuestionFormQuestion' => QuestionType::class,
        'QuestionChoice' => QuestionChoiceType::class,
        'TermAttendingNumbers' => TermAttendingNumbers::class,
        'SigninCheck' => SigninCheckType::class,
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
        'skill' => SkillType::class,
        'QuestionFormDescription' => QuestionFormDescriptionType::class,
        'QuestionAnswer' => QuestionAnswerType::class,
    ],

    'error_formatter' => ['\App\GraphQL\ErrorFormatter', 'formatError'],
    'params_key'    => 'variables',
];
