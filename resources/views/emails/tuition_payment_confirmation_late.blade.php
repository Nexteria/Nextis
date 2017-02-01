@extends('emails.layout')

@section('title')
  {{ trans('emails.payment_confirmation_title') }}
@endsection

@section('content')

<strong>Ahoj {{ $user->firstName }}.</strong>

<br>
<br>
Tvoja platba školného v NLA vo výške € {{ $payment->amount / 100 }} prišla o {{ $daysAfter }}.
Aby sa situácia s meškajúcim školným v budúcnosti neopakovala, prosím, nastav si v banke trvalý príkaz alebo upozornenie v kalendári.

<br>
<br>
Ďakujeme za pochopenie
<br>
Tvoj tím NLA
@endsection
