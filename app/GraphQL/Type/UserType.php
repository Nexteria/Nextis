<?php

namespace App\GraphQL\Type;

use App\User;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class UserType extends GraphQLType
{
    protected $attributes = [
        'name' => 'user',
        'description' => 'User type',
        'model' => User::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the user'
            ],
            'firstName' => [
                'type' => Type::string(),
                'description' => 'The first name of the user',
            ],
            'lastName' => [
                'type' => Type::string(),
                'description' => 'The last name of the user',
            ],
            'email' => [
                'type' => Type::string(),
                'description' => 'The email of the user',
            ],
            'phone' => [
                'type' => Type::string(),
                'description' => 'The phone of the user',
            ],
            'personalDescription' => [
                'type' => Type::string(),
                'description' => 'The personal description associated with this user',
            ],
            'facebookLink' => [
                'type' => Type::string(),
                'description' => 'The user`s facebook profile link',
            ],
            'linkedinLink' => [
                'type' => Type::string(),
                'description' => 'The user`s linkedin profile link',
            ],
            'actualJobInfo' => [
                'type' => Type::string(),
                'description' => 'The user`s actual job',
            ],
            'school' => [
                'type' => Type::string(),
                'description' => 'The users school',
            ],
            'studyProgram' => [
                'type' => Type::string(),
                'description' => 'The user`s study program',
            ],
            'studyYear' => [
                'type' => Type::string(),
                'description' => 'The year in school for user',
            ],
            'lectorDescription' => [
                'type' => Type::string(),
                'description' => 'The lector description associated with this user',
            ],
            'photo' => [
                'type' => Type::string(),
                'description' => 'The url of the photo of the user',
                'resolve' => function ($root, $args) {
                    if ($root->profilePicture) {
                        return $root->profilePicture->filePath;
                    }

                    return null;
                },
                'selectable' => false,
            ],
            'balance' => [
                'type' => Type::float(),
                'description' => 'The user balance',
                'resolve' => function ($root, $args) {
                    return $root->getAccountBalance();
                },
                'selectable' => false,
            ],
            'student' => [
                'type' => GraphQL::type('student'),
                'description' => 'Student associated with this user',
            ],
        ];
    }
}
