<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Permission as Permission;

class PermissionsController extends Controller
{
    /**
     * @var \App\Transformers\PermissionTransformer
     */
    protected $permissionTransformer;

    public function __construct(\App\Transformers\PermissionTransformer $permissionTransformer)
    {
        $this->permissionTransformer = $permissionTransformer;
    }

    public function getPermissions()
    {
        $permissions = Permission::all();

        return response()->json($this->permissionTransformer->transformCollection($permissions));
    }
}
