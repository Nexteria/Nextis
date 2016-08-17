<!DOCTYPE html>
<html>
    <head>
        <title>Nextis</title>
        {!! Html::style('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css') !!}
        {!! Html::style('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css') !!}
        {!! Html::style('https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css') !!}
        {!! Html::style('adminlte/css/AdminLTE.min.css') !!}
        {!! Html::style('adminlte/css/skins/_all-skins.min.css') !!}
        {!! Html::style('css/login.css') !!}
    </head>
    <body class="hold-transition skin-purple sidebar-mini fixed">
      @yield('content')
    </body>
</html>