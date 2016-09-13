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
    protected $paymentTransformer;

    public function __construct(
        \App\Transformers\UserTransformer $userTransformer,
        \App\Transformers\PaymentTransformer $paymentTransformer
    ) {
        $this->userTransformer = $userTransformer;
        $this->paymentTransformer = $paymentTransformer;
    }

    public function checkUsernameAvailability()
    {
        $username = \Input::get('username');
        if (strlen($username) < 5) {
            return response()->json([
              "error" => "Username is too short.",
              "code" => 400,
            ], 400);
        }

        if (\Input::has('id')) {
          $isAvailable = !User::where('username', '=', $username)->where('id', '!=', \Input::get('id'))->exists();  
        } else {
          $isAvailable = !User::where('username', '=', $username)->exists();
        }

        if (!$isAvailable) {
            return response()->json([
              "error" => "Username is not available",
              "code" => 403,
            ], 403);
        }

        return response()->json();
    }

    public function changePassword()
    {
        $user = \Auth::user();

        if (!\Hash::check(\Input::get('oldPassword'), $user->password)) {
            return response()->json([
              "error" => "Old password does not match!",
              "code" => 400,
            ], 400);
        }

        if (\Input::get('newPasswordConfirmation') !== \Input::get('newPassword')) {
            return response()->json([
              "error" => "New password does not match with confirmation!",
              "code" => 400,
            ], 400);
        }

        $user->password = \Hash::make(\Input::get('newPassword'));
        $user->save();
    }

    public function checkEmailAvailability()
    {
        $email = \Input::get('email');
        if (strlen($email) < 5) {
            return response()->json([
              "error" => "Email is too short.",
              "code" => 400,
            ], 400);
        }

        if (\Input::has('id')) {
          $isAvailable = !User::where('email', '=', $email)->where('id', '!=', \Input::get('id'))->exists();
        } else {
          $isAvailable = !User::where('email', '=', $email)->exists();
        }
        

        if (!$isAvailable) {
            return response()->json([
              "error" => "Email is not available",
              "code" => 403,
            ], 403);
        }

        return response()->json();
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

        return response()->json($this->userTransformer->transform($user->fresh(['roles'])));
    }

    public function confirmPrivacyPolicy()
    {
        $user = \Auth::user();
        $user->confirmedPrivacyPolicy = true;
        $user->confirmedMarketingUse = \Input::has('confirmedMarketingUse') ? \Input::get('confirmedMarketingUse') : false;
        $user->save();

        return response()->json($this->userTransformer->transform($user->fresh(['roles'])));
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

    public function getUserPayments($userId)
    {
        $user = User::findOrFail($userId);
        return response()->json($this->paymentTransformer->transformCollection($user->payments));
    }
}
