<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\NxEvent;

class CreateEventMutation extends Mutation
{
    protected $attributes = [
        'name' => 'CreateEvent'
    ];
    
    public function type()
    {
        return GraphQL::type('event');
    }
    
    public function args()
    {
        return [
            'name' => [
                'name' => 'name',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'activityPoints' => [
                'name' => 'activityPoints',
                'type' => Type::nonNull(Type::int()),
                'rules' => ['required'],
            ],
            'type' => [
                'name' => 'type',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required', 'in:dbk,ik,other'],
            ],
            'mandatoryParticipation' => [
                'name' => 'mandatoryParticipation',
                'type' => Type::nonNull(Type::boolean()),
                'rules' => ['required'],
            ],
            'curriculumLevelId' => [
                'name' => 'curriculumLevelId',
                'type' => Type::int(),
                'rules' => ['nullable', 'exists:student_levels,id'],
            ],
            'semesterId' => [
                'name' => 'semesterId',
                'type' => Type::int(),
                'rules' => ['exists:semesters,id'],
            ],
            'shortDescription' => [
                'name' => 'shortDescription',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'description' => [
                'name' => 'description',
                'type' => Type::string(),
                'rules' => [],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user->hasRole('ADMIN')) {
            return null;
        }

        $event = new NxEvent();
        
        $event->name = $args['name'];
        $event->activityPoints = $args['activityPoints'];
        $event->eventType = $args['type'];
        $event->mandatoryParticipation = $args['mandatoryParticipation'];
        $event->curriculumLevelId = $args['curriculumLevelId'];
        $event->shortDescription = clean($args['shortDescription']);
        $event->description = clean($args['description']);
        $event->semesterId = $args['semesterId'];
        $event->ownerId = $user->id;
        $event->emailTagBase = \Uuid::generate(4);
        $event->status = 'draft';

        $event->save();
        
        return $event;
    }

}