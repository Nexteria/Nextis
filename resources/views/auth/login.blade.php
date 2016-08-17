@extends('layouts.app')

@section('content')

<div class="login-container">
  <div class="login">
    <img src="/img/nexteria-logo.png" />
    <form class="form" role="form" method="POST" action="{{ url('/login') }}">
      {{ csrf_field() }}
      <input type="text" id="email" name="email" placeholder="Email" required="required" class="input-txt {{ $errors->has('email') ? ' has-error' : '' }}" value="{{ old('email') }}"/>
      @if ($errors->has('email'))
          <span class="help-block">
              <strong>{{ $errors->first('email') }}</strong>
          </span>
      @endif
      <input type="password" id="password" name="password" placeholder="Heslo" required="required" class="input-txt {{ $errors->has('password') ? ' has-error' : '' }}"  />
      @if ($errors->has('password'))
          <span class="help-block">
              <strong>{{ $errors->first('password') }}</strong>
          </span>
      @endif
      <div class="login-footer">
        <div class="login-utils">
          <label>
              <input type="checkbox" name="remember"> Remember Me
          </label>
          <a href="{{ url('/password/reset') }}">Forgot Your Password?</a>
        </div>
        <button type="submit" id="login_button" class="btn btn--right">Prihlásiť</button>
      </div>
    </form>
  </div>
</div>
@endsection
