@extends('emails.layout')

@section('title')
  {{ trans('emails.payment_confirmation_title') }}
@endsection

@section('content')

<strong>Ahoj {{ $user->firstName }}.</strong>

<br>
<br>
Ďakujeme, Tvoja platba školného v NLA vo výške € {{ $payment->amount / 100 }} bola úspešne zaevidovaná.

<br>
<br>
Prehľad platieb si môžeš pozrieť vo svojom profile v <a href="https://space.nexteria.sk" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #6DC6DD;font-weight: normal;text-decoration: underline;">Nexteria Space</a>.

<br>
<br>
Ďakujeme, že platíš načas. :)
<br>
Tvoj tím NLA
@endsection
