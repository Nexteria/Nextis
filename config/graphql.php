<?php

use App\GraphQL\Type\EventType;
use App\GraphQL\Type\NxEventTermType;
use App\GraphQL\Type\NxEventAttendeeType;
use App\GraphQL\Type\NxEventAttendeeGroupType;
use App\GraphQL\Type\QuestionFormType;

use App\GraphQL\Query\EventsQuery;

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
    ],

    'error_formatter' => ['\Rebing\GraphQL\GraphQL', 'formatError'],
    'params_key'    => 'variables',
];
