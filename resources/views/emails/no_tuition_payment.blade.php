@extends('emails.layout')

@section('title')
  Chýbajúca platba
@endsection

@section('content')

<strong>Ahoj {{ $user->firstName }}.</strong>

<br>
<br>
Tento mesiac neevidujeme platbu za školné, prípadne máš nedoplatok v Nexteria Leadership Academy. Aktuálna výška Tvojho nedoplatku je € {{ abs($debtAmount) / 100 }}.

<br>
<br>
Prosím, platbu zrealizuj čo najskôr.

<br>
<br>

Ďakujeme za pochopenie
<br>
Tvoj tím NLA
@endsection
