<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use GraphQL\Upload\UploadType;
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
                'rules' => ['required', 'image', 'size:1000'],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user) {
            return null;
        }

        $file = request()->file()[0];
        \Log::error($file);

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