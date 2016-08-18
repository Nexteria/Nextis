<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Payment;
use App\User;
use Illuminate\Http\Request;

class PaymentsController extends Controller
{
    /**
     * @var \App\Transformers\PaymentTransformer
     */
    protected $paymentTransformer;

    public function __construct(\App\Transformers\PaymentTransformer $paymentTransformer)
    {
        $this->paymentTransformer = $paymentTransformer;
    }

    public function processPayment()
    {
        $payment = Payment::parse(\Input::get('body-plain'));
    }

    public function getUnassociatedPayments()
    {
        $payments = Payment::whereNull('userId')->get();
        return response()->json($this->paymentTransformer->transformCollection($payments));
    }

    public function updatePayment($paymentId)
    {
        $payment = Payment::findOrFail($paymentId);
        $user = User::findOrFail(\Input::get('userId'));

        $payment->userId = $user->id;
        $payment->save();

        return response()->json($this->paymentTransformer->transform($payment));
    }
}
