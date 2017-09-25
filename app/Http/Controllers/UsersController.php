<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Role as Role;
use App\Image as Image;
use App\User as User;
use App\Payment as Payment;
use App\UserPaymentsSettings as UserPaymentsSettings;

class UsersController extends Controller
{
    /**
     * @var \App\Transformers\UserTransformer
     */
    protected $userTransformer;
    protected $paymentTransformer;
    protected $nxEventAttendeeTransformer;
    protected $userPaymentSettingsTransformer;
    protected $studentTransformer;

    public function __construct(
        \App\Transformers\UserTransformer $userTransformer,
        \App\Transformers\PaymentTransformer $paymentTransformer,
        \App\Transformers\NxEventAttendeeTransformer $nxEventAttendeeTransformer,
        \App\Transformers\UserPaymentSettingsTransformer $userPaymentSettingsTransformer,
        \App\Transformers\StudentSemesterTransformer $studentSemesterTransformer,
        \App\Transformers\StudentTransformer $studentTransformer
    ) {
        $this->userTransformer = $userTransformer;
        $this->paymentTransformer = $paymentTransformer;
        $this->userPaymentSettingsTransformer = $userPaymentSettingsTransformer;
        $this->nxEventAttendeeTransformer = $nxEventAttendeeTransformer;
        $this->studentSemesterTransformer = $studentSemesterTransformer;
        $this->studentTransformer = $studentTransformer;
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
        $user->save();

        return response()->json($this->userTransformer->transform($user->fresh(['roles'])));
    }

    public function getUsers($userId = null)
    {
        if ($userId) {
            if ($userId === 'me') {
                $data = [
                  'user' => $this->userTransformer->transform(\Auth::user()->fresh(['roles'], ['gainedActivityPoints', 'potentialActivityPoints'])),
                ];

                if (\Auth::user()->hasRole('STUDENT')) {
                    $data['student'] = $this->studentTransformer->transform(\Auth::user()->student);
                }

                return response()->json($data);
            }

            return response()->json($this->userTransformer->transform(User::findOrFail($userId)->fresh(['roles'], ['gainedActivityPoints', 'potentialActivityPoints'])));
        }

        $users = User::with('roles')
            ->with('hostedEvents')
            ->with('student')
            ->with('eventAttendees')
            ->with('eventAttendees.attendeesGroup')
            ->with('eventAttendees.attendeesGroup.nxEvent')
            ->get();

        if (\Auth::user()->hasRole('ADMIN')) {
            return response()->json($this->userTransformer->transformCollection($users, ['gainedActivityPoints', 'potentialActivityPoints']));
        }

        return response()->json($this->userTransformer->transformCollection($users, []));
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

    public function getUsersPayments()
    {
        $users = User::with('payments')->get();
        $data = [];
        foreach ($users as $user) {
            $data[$user->id] = $this->paymentTransformer->transformCollection($user->payments);
        }

        return response()->json($data);
    }

    public function getActivityPoints(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $attendees = $user->eventAttendees;

        $semesterId = \App\DefaultSystemSettings::get('activeSemesterId');
        if ($request->has('semesterId')) {
            $semesterId = $request->input('semesterId');
        }

        $attendees = $attendees->filter(function ($attendee, $key) use ($semesterId) {
            if (!$attendee->event()) {
                return false;
            }

            return $attendee->event()->semesterId == $semesterId;
        });

        return response()->json($this->nxEventAttendeeTransformer->transformCollection($attendees, ['event']));
    }

    public function getSemesters($userId)
    {
        $user = User::findOrFail($userId);
        $semesters = $user->student->semesters;

        $semesters = $this->studentSemesterTransformer->transformCollection($semesters);
        $newSemesters = [];
        foreach ($semesters as &$semester) {
            $semester['gainedActivityPoints'] = $user->computeActivityPoints($semester['id']);
            $newSemesters[] = $semester;
        }

        return response()->json($newSemesters);
    }

    public function deletePayments(Request $request, $userId)
    {
        $paymentsIds = $request->input('payments');
        $payments = Payment::whereIn('id', $paymentsIds)->get();
        
        foreach ($payments as $payment) {
            if ($payment->userId != $userId) {
                return response()->json([
                  "error" => "All payments must belong to specified user!",
                  "code" => 400,
                ], 400);
            }
        }

        foreach ($payments as $payment) {
            $payment->delete();
        }

        return $this->getUserPayments($userId);
    }

    public function getUserPaymentsSettings($userId)
    {
        $user = User::findOrFail($userId);

        if (!$user->paymentSettings) {
            abort(404);
        }

        return response()->json($this->userPaymentSettingsTransformer->transform($user->paymentSettings));
    }

    public function updateUserPaymentsSettings(Request $request, $userId)
    {
        $validator = \Validator::make($request->all(), [
          'schoolFeePaymentsDeadlineDay' => 'required|numeric|min:1|max:31',
          'checkingSchoolFeePaymentsDay' => 'required|numeric|min:1|max:31',
          'generationSchoolFeeDay' => 'required|numeric|min:1|max:31',
          'disableEmailNotifications' => 'required|boolean',
          'disableSchoolFeePayments' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $user = User::findOrFail($userId);

        if (!$user->paymentSettings) {
            $user->paymentSettings()->save(new UserPaymentsSettings($request->all()));
        } else {
            $user->paymentSettings->update($request->all());
        }

        return response()->json([], 200);
    }
}
