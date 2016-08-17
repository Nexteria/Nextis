<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\UserGroup as UserGroup;
use App\User as User;

class UserGroupsController extends Controller
{
    /**
     * @var \App\Transformers\UserGroupTransformer
     */
    protected $userGroupTransformer;

    public function __construct(\App\Transformers\UserGroupTransformer $userGroupTransformer)
    {
        $this->userGroupTransformer = $userGroupTransformer;
    }

    public function createUserGroup()
    {
        $group = UserGroup::createNew(\Input::all());

        return response()->json($this->userGroupTransformer->transform($group));
    }

    public function updateUserGroup()
    {
        $group = UserGroup::findOrFail(\Input::get('id'));
        $group->ownerId = \Auth::user()->id;
        $group->users()->sync(User::whereIn('id', \Input::get('users'))->lists('id')->toArray());

        $group->save();
        return response()->json($this->userGroupTransformer->transform($group));
    }

    public function getUserGroup()
    {
        $groups = UserGroup::with('users')->get();

        return response()->json($this->userGroupTransformer->transformCollection($groups));
    }

    public function deleteUserGroup($groupId)
    {
        UserGroup::findOrFail($groupId)->delete();
    }
}
