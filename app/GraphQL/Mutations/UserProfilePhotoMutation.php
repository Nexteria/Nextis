<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\UploadType;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\Image;

class UserProfilePhotoMutation extends Mutation
{

    protected $attributes = [
        'name' => 'UpdateUserProfilePhoto'
    ];
    
    public function type()
    {
        return GraphQL::type('user');
    }
    
    public function args()
    {
        return [
            'profilePicture' => [
                'name' => 'profilePicture',
                'type' => new UploadType(),
                'rules' => ['required', 'image', 'max:1500'],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user) {
            return null;
        }

        $file = $args['profilePicture'];

        $data = [
            'file' => $file,
            'title' => $user->firstName.' '.$user->lastName,
            'description' => 'Profile picture',
        ];

        $profilePicture = Image::store($data);

        $user->profilePictureId = $profilePicture->id;
        $user->save();
        
        return $user;
    }

}