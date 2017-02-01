@extends('emails.layout')

@section('title')
  {{ trans('emails.payment_confirmation_title') }}
@endsection

@section('content')

<strong>Ahoj {{ $user->firstName }}.</strong>

<br>
<br>
Výška tvojho školného, ktoré malo prísť na zaplatenie je € {{ ($debtAmount + $payment->amount) / 100 }}. Prosím uhraď zvyšných € {{ $debtAmount / 100 }} čo najskôr.
Platba školného v NLA, ktoré si nám zaslal, vo výške € {{ $payment->amount / 100 }} bola však úspešne zaevidovaná,

<br>
<br>
Ďakujeme za pochopenie
<br>
Tvoj tím NLA
@endsection
