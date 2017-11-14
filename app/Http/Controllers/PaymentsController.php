<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use App\Payment;
use App\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PaymentsController extends Controller
{
    /**
     * @var \App\Transformers\PaymentTransformer
     */
    protected $paymentTransformer;

    /**
     * @var \App\Transformers\TuitionDefaultSettingsTransformer
     */
    protected $tuitionDefaultSettingsTransformer;

    public function __construct(
      \App\Transformers\PaymentTransformer $paymentTransformer,
      \App\Transformers\TuitionDefaultSettingsTransformer $tuitionDefaultSettingsTransformer
    )
    {
        $this->paymentTransformer = $paymentTransformer;
        $this->tuitionDefaultSettingsTransformer = $tuitionDefaultSettingsTransformer;
    }

    public function processPayment()
    {
        $payment = Payment::parse(\Input::get('body-plain'));

        if ($payment->user && $payment->user->hasRole('STUDENT')) {
            $email = null;
            if ($payment->user->student && $payment->variableSymbol == $payment->user->student->tuitionFeeVariableSymbol) {
                $email = new \App\Mail\ReceivedTuitionFeeConfirmation($payment);
            } else {
                $email = new \App\Mail\ReceivedPaymentConfirmation($payment);
            }
            
            \Mail::send($email);
        }
    }

    public function getUnassociatedPayments()
    {
        $payments = Payment::whereNull('userId')->get();
        return response()->json($this->paymentTransformer->transformCollection($payments));
    }

    public function getGlobalPaymentsSettings()
    {
        $settings = \App\TuitionDefaultSettings::first();
        return response()->json($this->tuitionDefaultSettingsTransformer->transform($settings));
    }

    public function updateGlobalPaymentsSettings(Request $request)
    {
        $validator = \Validator::make($request->all(), [
          'schoolFeePaymentsDeadlineDay' => 'required|numeric|min:1|max:31',
          'checkingSchoolFeePaymentsDay' => 'required|numeric|min:1|max:31',
          'generationSchoolFeeDay' => 'required|numeric|min:1|max:31',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $settings = \App\TuitionDefaultSettings::first();
        $settings->update($request->all());

        return response()->json($this->tuitionDefaultSettingsTransformer->transform($settings));
    }

    public function updatePayment($paymentId)
    {
        $payment = Payment::findOrFail($paymentId);
        $user = User::findOrFail(\Input::get('userId'));

        $payment->userId = $user->id;
        $payment->save();

        return response()->json($this->paymentTransformer->transform($payment));
    }

    public function exportTuitionSumary()
    {
        $from = Carbon::createFromFormat('Y-m-d H:i:s', \Input::get('from'));
        $to = Carbon::createFromFormat('Y-m-d H:i:s', \Input::get('to'));

        $levels = [];

        $studentLevels = \App\StudentLevel::get();
        foreach ($studentLevels as $level) {
            $levels[$level->id] = [
              'name' => $level->name,
              'students' => [],
              'debetTotal' => 0,
              'kreditTotal' => 0,
            ];
        }

        $activeStudents = \App\Student::where('status', \Config::get('constants.states.ACTIVE'))->get();

        $activeStudents->each(function ($student) use (&$levels, $from, $to) {
            $debetPaymentsSum = Payment::where('transactionType', 'debet')
                                    ->where('variableSymbol', $student->tuitionFeeVariableSymbol)
                                    ->where('deadline_at', '<=', $to)
                                    ->where('created_at', '>=', $from)
                                    ->get()
                                    ->sum('amount') / 100;

            $kreditPaymentsSum = Payment::where('transactionType', 'kredit')
                                    ->where('variableSymbol', $student->tuitionFeeVariableSymbol)
                                    ->where('created_at', '<=', $to)
                                    ->where('created_at', '>=', $from)
                                    ->get()
                                    ->sum('amount') / 100;

            $levels[$student->studentLevelId]['students'][] = [
              'name' => $student->firstName.' '.$student->lastName,
              'debetPaymentsSum' => $debetPaymentsSum,
              'kreditPaymentsSum' => $kreditPaymentsSum,
            ];

            $levels[$student->studentLevelId]['debetTotal'] += $debetPaymentsSum;
            $levels[$student->studentLevelId]['kreditTotal'] += $kreditPaymentsSum;
        });

        return \Excel::create('Prehľad školného', function ($excel) use ($levels) {
            $excel->sheet('First sheet', function ($sheet) use ($levels) {
                $sheet->loadView('exports.tuition_summary', ['levels' => $levels]);
            });
        })->download('xls');
    }

    public function importPayments()
    {
        $reader = \Excel::load(\Input::file('file'));
        $payments = $reader->toArray();

        // validation
        foreach ($payments as $row) {
            if (!User::where('id', $row['user_id'])->exists()) {
                return response()->json([
                  'error' => 'User with id: '.$row['user_id'].' was not found.',
                ], 404);
            }

            if (floatval($row['amount']) <= 0) {
                return response()->json([
                  'error' => 'All amounts must be greater then 0.',
                ], 400);
            }

            if ($row['transaction_type'] !== 'debet' && $row['transaction_type'] !== 'kredit') {
                return response()->json([
                  'error' => 'Transaction type must be one of "kredit" or "debet"!',
                ], 400);
            }

            try {
                Carbon::createFromFormat('Y-m-d H:i:s', $row['created_at']);
            } catch (\InvalidArgumentException $ex) {
                return response()->json([
                  'error' => 'Created at is in wrong format!',
                ], 400);
            }

            try {
                Carbon::createFromFormat('Y-m-d H:i:s', $row['deadline_at']);
            } catch (\InvalidArgumentException $ex) {
                return response()->json([
                  'error' => 'Deadline at is in wrong format!',
                ], 400);
            }

            try {
                Carbon::createFromFormat('Y-m-d H:i:s', $row['valid_from']);
            } catch (\InvalidArgumentException $ex) {
                return response()->json([
                  'error' => 'Valid from is in wrong format!',
                ], 400);
            }
        }

        foreach ($payments as $row) {
            $newPayment = new Payment();
            $newPayment->message = $row['message'];
            $newPayment->transactionType = $row['transaction_type'];
            $newPayment->userId = $row['user_id'];
            $newPayment->deadline_at = Carbon::createFromFormat('Y-m-d H:i:s', $row['deadline_at']);
            $newPayment->addedByUserId = \Auth::user()->id;
            $newPayment->amount = floatval($row['amount']) * 100;
            $newPayment->variableSymbol = $row['variable_symbol'];
            $newPayment->description = 'Imported';
            $newPayment->created_at = Carbon::createFromFormat('Y-m-d H:i:s', $row['created_at']);
            $newPayment->save();
        }
    }

    public function createPayments(Request $request)
    {
        $this->validate($request, [
            'amount' => 'required|numeric|min:0',
            'description' => 'required',
            'variableSymbol' => 'required|numeric',
            'deadlineAt' => 'required|date',
            'validFrom' => 'required|date',
            'transactionType' => 'required|in:kredit,debet',
            'users' => 'required|array|min:1',
        ]);

        $validFrom = Carbon::createFromFormat('Y-m-d', $request->input('validFrom'));
        $deadlineAt = Carbon::createFromFormat('Y-m-d', $request->input('deadlineAt'));

        if ($validFrom->gt($deadlineAt)) {
            return response()->json([
              "error" => "Valid from date can not be after deadline",
              "code" => 400,
            ], 400);
        }

        foreach ($request->input('users') as $userId) {
            User::findOrFail($userId);
        }

        foreach ($request->input('users') as $userId) {
            $newPayment = new Payment();
            $newPayment->message = $request->input('description');
            $newPayment->transactionType = $request->input('transactionType');
            $newPayment->userId = $userId;
            $newPayment->deadline_at = $deadlineAt;
            $newPayment->valid_from = $validFrom;
            $newPayment->addedByUserId = \Auth::user()->id;
            $newPayment->amount = floatval($request->input('amount')) * 100;
            $newPayment->variableSymbol = $request->input('variableSymbol');
            $newPayment->description = 'Imported';
            $newPayment->created_at = Carbon::now();
            $newPayment->save();
        }

        return response()->json([]);
    }
}
