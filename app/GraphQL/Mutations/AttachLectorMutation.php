<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\NxEvent;

class AttachLectorMutation extends Mutation
{
    protected $attributes = [
        'name' => 'AttachLector'
    ];
    
    public function type()
    {
        return GraphQL::type('event');
    }
    
    public function args()
    {
        return [
            'lectorId' => [
                'name' => 'lectorId',
                'type' => Type::nonNull(Type::int()),
                'rules' => ['required'],
            ],
            'eventId' => [
              'name' => 'eventId',
              'type' => Type::nonNull(Type::int()),
              'rules' => ['required'],
          ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user->hasRole('ADMIN')) {
            return null;
        }

        $event = NxEvent::findOrFail($args['eventId']);
        $event->lectors()->save(User::findOrFail($args['lectorId']));

        $event->save();
        return $event;
    }

}