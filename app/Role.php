<?php

namespace App;

use Zizaco\Entrust\EntrustRole;
use App\Permission;

class Role extends EntrustRole
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    public static function createNew($attributes = [])
    {
        $role = Role::create($attributes);
        $role->save();

        $role->perms()->sync(Permission::whereIn('id', $attributes['permissions'])->lists('id')->toArray());

        $role->save();
        return $role;
    }

    public function updateData($attributes = [])
    {
        $this->fill($attributes);

        if (isset($attributes['permissions'])) {
            $this->perms()->sync(Permission::whereIn('id', $attributes['permissions'])->lists('id')->toArray());
        }

        $this->save();
    }
}
