<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\NxEventAttendee;
use App\NxEvent;
use Carbon\Carbon;

class PasswordChangeMutation extends Mutation
{
    protected $attributes = [
        'name' => 'PasswordChange'
    ];
    
    public function type()
    {
        return GraphQL::type('user');
    }
    
    public function args()
    {
        return [
            'userId' => [
                'name' => 'userId',
                'type' => Type::nonNull(Type::int()),
                'rules' => ['required'],
            ],
            'oldPassword' => [
                'name' => 'oldPassword',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['string', 'required'],
            ],
            'newPassword' => [
                'name' => 'newPassword',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['string', 'required'],
            ],
            'newPasswordConfirmation' => [
                'name' => 'newPasswordConfirmation',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['string', 'required'],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user) {
            return new \Exception("Na túto operáciu nemáš oprávnenie");
        }

        if ($user->id !== $args['userId']) {
            return new \Exception("Na túto operáciu nemáš oprávnenie");
        }

        if (!\Hash::check($args['oldPassword'], $user->password)) {
            return new \Exception("Aktuálne heslo bolo zadané nesprávne");
        }

        if ($args['newPassword'] !== $args['newPasswordConfirmation']) {
            return new \Exception("Nové heslo sa nezhoduje s potvrdením");
        }

        $user->password = \Hash::make($args['newPassword']);
        $user->save();

        return $user;
    }
}