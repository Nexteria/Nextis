<?php namespace App\Transformers;

class PermissionTransformer extends Transformer
{

    public function transform($permission)
    {
        return [
          'id' => (int) $permission->id,
          'name' => $permission->name,
          'display_name' => $permission->display_name,
          'description' => $permission->description,
        ];
    }
}
