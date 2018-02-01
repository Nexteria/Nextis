<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\NxLocation as NxLocation;
use App\UserGroup as UserGroup;
use App\User as User;

class NxLocationsController extends Controller
{
    /**
     * @var \App\Transformers\NxLocationTransformer
     */
    protected $nxLocationTransformer;

    public function __construct(\App\Transformers\NxLocationTransformer $nxLocationTransformer)
    {
        $this->nxLocationTransformer = $nxLocationTransformer;
    }

    public function createNxLocation()
    {
        $location = NxLocation::createNew(\Input::all());

        return response()->json($this->nxLocationTransformer->transform($location));
    }

    public function updateNxLocation()
    {
        $location = NxLocation::findOrFail(\Input::get('id'));
        $location->updateData(\Input::all());

        return response()->json($this->nxLocationTransformer->transform($location->fresh()));
    }

    public function getNxLocations()
    {
        $locations = NxLocation::withTrashed()->get();

        return response()->json($this->nxLocationTransformer->transformCollection($locations));
    }

    public function deleteNxLocation($locationId)
    {
        NxLocation::findOrFail($locationId)->delete();
    }
}
