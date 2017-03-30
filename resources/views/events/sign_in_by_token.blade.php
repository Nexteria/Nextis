@extends('layouts.app')

@section('content')

<div class="signin-container">
  <div class="signin">
    <img src="/img/nexteria-logo.png" />
      <h2>Ahoj {{ $attendeeName }},</h2>
      <p>{{ $message }}</p>
      
      @if ($signInFailed)
        <p><i class="fa fa-ban"></i></p>
      @endif

      @if (!$signInFailed)
        <p><i class="fa fa-check-circle-o"></i></p>
      @endif

      @if (isset($wontGo) && $wontGo)
        <form role="form" method="post" action="/nxEvents/{{ $signInToken }}/wontGo">
          <div class="form-group">
            <label for="reason">Dôvod (min. 100 znakov):</label>
            <textarea id="reason" name="reason"></textarea>
          </div>
          <button class="btn btn-info" type="submit">Odoslať</button>
        </form>
      @endif
  </div>
</div>
@endsection
