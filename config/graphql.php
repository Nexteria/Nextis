<?php

use App\GraphQL\Type\EventType;
use App\GraphQL\Type\NxEventTermType;
use App\GraphQL\Type\NxEventAttendeeType;
use App\GraphQL\Type\NxEventAttendeeGroupType;
use App\GraphQL\Type\NxLocationType;
use App\GraphQL\Type\TermAttendingNumbers;
use App\GraphQL\Type\UserType;
use App\GraphQL\Type\QuestionFormType;

use App\GraphQL\Query\EventsQuery;
use App\GraphQL\Query\EventQuery;

return [
    'prefix' => 'graphql',
    'routes' => '{graphql_schema?}',
    'controllers' => \Rebing\GraphQL\GraphQLController::class . '@query',
    'middleware' => [],
    'default_schema' => 'default',

    'schemas' => [
        'default' => [
            'query' => [
                'events' => EventsQuery::class,
                'event' => EventQuery::class,
            ],
            'mutation' => [
            ],
            'middleware' => []
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
        'User' => UserType::class,
    ],

    'error_formatter' => ['\Rebing\GraphQL\GraphQL', 'formatError'],
    'params_key'    => 'variables',
];
