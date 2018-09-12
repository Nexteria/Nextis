<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\NxLocation;

class LocationMutation extends Mutation
{

    protected $attributes = [
        'name' => 'UpdateLocation'
    ];
    
    public function type()
    {
        return GraphQL::type('NxLocation');
    }
    
    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int(),
            ],
            'name' => [
                'name' => 'name',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'addressLine1' => [
                'name' => 'addressLine1',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'addressLine2' => [
                'name' => 'addressLine2',
                'type' => Type::nonNull(Type::string()),
            ],
            'city' => [
                'name' => 'city',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'zipCode' => [
                'name' => 'zipCode',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'countryCode' => [
                'name' => 'countryCode',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'instructions' => [
                'name' => 'instructions',
                'type' => Type::nonNull(Type::string()),
            ],
            'description' => [
                'name' => 'description',
                'type' => Type::nonNull(Type::string()),
            ],
            'latitude' => [
                'name' => 'latitude',
                'type' => Type::nonNull(Type::float()),
                'rules' => ['required'],
            ],
            'longitude' => [
                'name' => 'longitude',
                'type' => Type::nonNull(Type::float()),
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

        $location = new NxLocation();

        if ($args['id']) {
            $location = NxLocation::findOrFail($args['id']);
        }
        
        $location->name = $args['name'];
        $location->addressLine1 = $args['addressLine1'];
        $location->addressLine2 = $args['addressLine2'];
        $location->city = $args['city'];
        $location->zipCode = $args['zipCode'];
        $location->countryCode = $args['countryCode'];
        $location->instructions = clean($args['instructions']);
        $location->description = clean($args['description']);
        $location->latitude = $args['latitude'];
        $location->longitude = $args['longitude'];
        $location->ownerId = $user->id;

        $location->save();
        
        return $location;
    }

}