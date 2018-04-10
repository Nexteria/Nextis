@extends('emails.layout')

@section('title')
  {{ trans('emails.payment_confirmation_title') }}
@endsection

@section('content')
<strong>Ahoj {{ $user->firstName }}.</strong>

<br>
<br>
Vďaka nesprávne zadanému variabilnému symbolu sa nám nepodarilo priradiť k tvojej platbe účel. Tvoja platba vo výške € {{ $payment->amount / 100 }} však prebehla úspešne. 
<br>
<br>
Kontaktuj, prosím, Janku na čísle +421 911 257 919.
<br>

Tím NLA
@endsection
