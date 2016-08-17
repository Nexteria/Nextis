<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\StudentLevel as StudentLevel;

class LevelsController extends Controller
{
    public function getLevels($id = null)
    {
        $roles = $id ? StudentLevel::find($id) : StudentLevel::all();

        return response()->json($roles);
    }
}
