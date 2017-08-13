@extends('layouts.app')

@section('headerScripts')
{!! React::style('publicSignin') !!}
@endsection

@section('content')
<div id="signin-container">
</div>
@endsection

@section('bodyScripts')
{!! React::script('publicSignin') !!}
@endsection

