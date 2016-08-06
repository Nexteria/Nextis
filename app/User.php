<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Alsofronie\Uuid\UuidModelTrait;

class User extends Authenticatable
{

    use UuidModelTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
}
