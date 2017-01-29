<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Role;
use App\StudentLevel;

class UserGroup extends Authenticatable
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
    ];

    protected $dates = ['deleted_at'];

    public static function createNew($attributes = [])
    {
        $group = UserGroup::create($attributes);
        $group->ownerId = \Auth::user()->id;
        $group->users()->sync(User::whereIn('id', $attributes['users'])->pluck('id')->toArray());

        $group->save();
        return $group;
    }

    public function users()
    {
        return $this->belongsToMany('App\User');
    }
}
