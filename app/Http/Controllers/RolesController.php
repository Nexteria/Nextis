<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Role as Role;

class RolesController extends Controller
{
    /**
     * @var \App\Transformers\RoleTransformer
     */
    protected $roleTransformer;

    public function __construct(\App\Transformers\RoleTransformer $roleTransformer)
    {
        $this->roleTransformer = $roleTransformer;
    }

    public function getRoles($id = null)
    {
        $roles = $id ? Role::find($id) : Role::all();

        return response()->json($this->roleTransformer->transformCollection($roles));
    }

    public function createRole()
    {
        $input = \Input::all();
        $role = Role::createNew($input);

        return response()->json($this->roleTransformer->transform($role));
    }

    public function updateRole()
    {
        $role = Role::findOrFail(\Input::get('id'));
        $role->updateData(\Input::all());

        return response()->json($this->roleTransformer->transform($role));
    }

    public function deleteRole($roleId)
    {
        Role::findOrFail($roleId)->delete();
    }
}
