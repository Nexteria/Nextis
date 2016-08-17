<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Role as Role;
use App\Image as Image;
use App\User as User;

class UsersController extends Controller
{
    /**
     * @var \App\Transformers\UserTransformer
     */
    protected $userTransformer;

    public function __construct(\App\Transformers\UserTransformer $userTransformer)
    {
        $this->userTransformer = $userTransformer;
    }

    public function createUser()
    {
        $profilePicture = null;
        if (\Input::has('photo')) {
            $data = [
              'file' => \Input::file('photo'),
              'title' => \Input::get('photoTitle'),
              'description' => \Input::get('photoDescription'),
            ];

            $profilePicture = Image::store($data);
        }

        $input = \Input::all();
        $input['profilePicture'] = $profilePicture;
        $user = User::createNew($input);

        return response()->json($this->userTransformer->transform($user->fresh(['roles'])));
    }

    public function updateUser()
    {
        $user = User::findOrFail(\Input::get('id'));
        $user->updateData(\Input::all());

        return response()->json($user->fresh(['roles']));
    }

    public function getUsers($userId = null)
    {
        if ($userId) {
            if ($userId === 'me') {
                return response()->json($this->userTransformer->transform(\Auth::user()->fresh(['roles'])));
            }

            return response()->json($this->userTransformer->transform(User::findOrFail($userId)->fresh(['roles'])));
        }

        $users = User::with(['roles'])->get();
        return response()->json($this->userTransformer->transformCollection($users));
    }

    public function deleteUser($userId)
    {
        User::findOrFail($userId)->delete();
    }
}
