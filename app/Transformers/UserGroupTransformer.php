<?php namespace App\Transformers;

class UserGroupTransformer extends Transformer {

    public function transform($userGroup)
    {
       return [
          'id' => (int) $userGroup->id,
          'name' => $userGroup->name,
          'levelId' => $userGroup->studentLevel ? $userGroup->studentLevel->id : null,
          'users' => $userGroup->users->pluck('id'),
       ];
    }
}