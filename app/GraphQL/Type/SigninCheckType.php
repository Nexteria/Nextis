<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class SigninCheckType extends GraphQLType
{
    protected $attributes = [
        'name' => 'SigninCheckType',
        'description' => 'Response type for checking of ability to sign',
    ];

    public function fields()
    {
        return [
            'message' => [
                'type' => Type::string(),
                'description' => 'Readable message for user',
                'selectable' => false,
            ],
            'codename' => [
                'type' => Type::string(),
                'description' => 'The codename of the message',
                'selectable' => false,
            ],
            'canSignIn' => [
                'type' => Type::boolean(),
                'description' => 'Flag if the user can signin or not',
                'selectable' => false,
            ],
        ];
    }
}
