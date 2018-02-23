<?php

namespace App\GraphQL\Type;

use App\NxLocation;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class NxLocationType extends GraphQLType
{
    protected $attributes = [
        'name' => 'NxLocation',
        'description' => 'Nx location type',
        'model' => NxLocation::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the location'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'The name of the location',
            ],
        ];
    }
}
