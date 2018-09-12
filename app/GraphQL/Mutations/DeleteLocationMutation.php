<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\NxLocation;

class DeleteLocationMutation extends Mutation
{

    protected $attributes = [
        'name' => 'DeleteLocation'
    ];
    
    public function type()
    {
        return Type::boolean();
    }
    
    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int(),
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user->hasRole('ADMIN')) {
            return false;
        }

        $location = NxLocation::findOrFail($args['id']);
        $location->delete();
        
        return true;
    }

}