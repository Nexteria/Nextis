<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;

class UserProfileMutation extends Mutation
{

    protected $attributes = [
        'name' => 'UpdateUserProfile'
    ];
    
    public function type()
    {
        return GraphQL::type('user');
    }
    
    public function args()
    {
        return [
            'firstName' => [
                'name' => 'firstName',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'lastName' => [
                'name' => 'lastName',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'email' => [
                'name' => 'email',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required', 'email'],
            ],
            'phone' => [
                'name' => 'phone',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required', 'phone:SK'],
            ],
            'facebookLink' => [
                'name' => 'facebookLink',
                'type' => Type::string(),
                'rules' => ['required', 'url'],
            ],
            'linkedinLink' => [
                'name' => 'linkedinLink',
                'type' => Type::string(),
                'rules' => ['required', 'url'],
            ],
            'actualJobInfo' => [
                'name' => 'actualJobInfo',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'school' => [
                'name' => 'school',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'faculty' => [
                'name' => 'faculty',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'studyProgram' => [
                'name' => 'studyProgram',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'dateOfBirth' => [
                'name' => 'dateOfBirth',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required', 'date'],
            ],
            'personalDescription' => [
                'name' => 'personalDescription',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required', 'min:150'],
            ],
            'studyYear' => [
                'name' => 'studyYear',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'skills' => [
                'name' => 'skills',
                'type' => Type::listOf(Type::int()),  # list of skill IDs
                'rules' => ['present', 'array'],
            ]
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user) {
            return null;
        }
        
        $user->firstName = $args['firstName'];
        $user->lastName = $args['lastName'];
        $user->email = $args['email'];
        $user->phone = $args['phone'];
        $user->facebookLink = $args['facebookLink'];
        $user->linkedinLink = $args['linkedinLink'];
        $user->actualJobInfo = $args['actualJobInfo'];
        $user->school = $args['school'];
        $user->faculty = $args['faculty'];
        $user->studyProgram = $args['studyProgram'];
        $user->dateOfBirth = $args['dateOfBirth'];
        $user->personalDescription = $args['personalDescription'];
        $user->studyYear = $args['studyYear'];

        $user->skills()->sync($args['skills']);

        $user->save();
        
        return $user;
    }

}