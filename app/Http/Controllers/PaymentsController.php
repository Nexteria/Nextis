<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Payment;
use Illuminate\Http\Request;

class PaymentsController extends Controller
{  
    public function processPayment()
    {
        $payment = Payment::parse(\Input::get('body-plain'));
    }
}
