@extends('emails.layout')

@section('title')
  {{ trans('emails.payment_confirmation_title') }}
@endsection

@section('content')
<strong>{{ trans('emails.payment_confirmation_greating', ['first_name' => $user->firstName]) }}.</strong>

<br>
<br>
{{ trans('emails.payment_confirmation_thanks', ['amount' => $payment->amount / 100]) }}

<br>
<br>
<strong>
  {{ trans('emails.payment_confirmation_balance') }}:
  <span style="color:{{ $user->getAccountBalance() >= 0 ? 'green' : 'red' }}">€{{ $user->getAccountBalance() / 100 }}</span>
</strong>

<br>
{{ trans('emails.payment_confirmation_balance_details') }}<a href="https://space.nexteria.sk" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #6DC6DD;font-weight: normal;text-decoration: underline;">Nexteria Space</a>.

<br>
<br>
{{ trans('emails.payment_confirmation_footer') }}
@endsection
