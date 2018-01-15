<?php

namespace App\GraphQL\Query;

use App\NxEvent;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\SelectFields;

class EventsQuery extends Query
{
    protected $attributes = [
        'name' => 'Events Query',
        'description' => 'A query of events'
    ];

    public function type()
    {
        // result of query with pagination laravel
        return Type::listOf(GraphQL::type('event'));
    }
    
    // arguments to filter query
    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int()
            ],
            'eventType' => [
                'name' => 'eventType',
                'type' => Type::string()
            ],
            'status' => [
                'name' => 'status',
                'type' => Type::string()
            ],
            'curriculumLevelId' => [
                'name' => 'curriculumLevelId',
                'type' => Type::int()
            ],
            'semesterId' => [
                'name' => 'semesterId',
                'type' => Type::int()
            ],
        ];
    }

    public function resolve($root, $args, SelectFields $fields)
    {
        $where = function ($query) use ($args, $fields) {
            if (isset($args['id'])) {
                $query->where('id', $args['id']);
            }
            if (isset($args['eventType'])) {
                $query->where('eventType', $args['eventType']);
            }
            if (isset($args['status'])) {
                $query->where('status', $args['status']);
            }
            if (isset($args['curriculumLevelId'])) {
                $query->where('curriculumLevelId', $args['curriculumLevelId']);
            }
            if (isset($args['semesterId'])) {
                $query->where('semesterId', $args['semesterId']);
            }
        };

        $events = NxEvent::with(array_keys($fields->getRelations()))
            ->where($where)
            ->select($fields->getSelect())
            ->selectRaw('(nx_events.signInFormId is not null) as hasSignInQuestionaire')
            ->get();

        return $events;
    }
}
