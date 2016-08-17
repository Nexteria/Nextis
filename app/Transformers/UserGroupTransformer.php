<?php namespace App\Transformers;

class UserGroupTransformer extends Transformer {

    public function transform($userGroup)
    {
       return [
          'id' => (int) $userGroup->id,
          'name' => $userGroup->name,
          'users' => $userGroup->users->lists('id'),
       ];
    }
}