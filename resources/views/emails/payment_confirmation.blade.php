@extends('emails.layout')

@section('title')
  {{ trans('emails.payment_confirmation_title') }}
@endsection

@section('content')
<strong>Ahoj {{ $user->firstName }}.</strong>

<br>
<br>
Tvoja platba vo výške € {{ $payment->amount / 100 }} prebehla úspešne. Ďakujeme
<br>

Tím NLA
@endsection
