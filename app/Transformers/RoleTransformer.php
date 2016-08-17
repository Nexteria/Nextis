<?php namespace App\Transformers;

class RoleTransformer extends Transformer
{

    public function transform($role)
    {

        $transformer = new PermissionTransformer();
        $permissions = $transformer->transformCollection($role->perms);

        return [
          'id' => (int) $role->id,
          'name' => $role->name,
          'display_name' => $role->display_name,
          'description' => $role->description,
          'permissions' => $permissions,
        ];
    }
}
