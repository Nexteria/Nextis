<!DOCTYPE html>
<html>
    <head>
        <title>Nexteria Space</title>
        {!! Html::style('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css') !!}
        {!! Html::style('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css') !!}
        {!! Html::style('https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css') !!}
        {!! Html::style('https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css') !!}
        {!! Html::style('adminlte/css/AdminLTE.css') !!}
        {!! Html::style('adminlte/css/skins/_all-skins.css') !!}
        {!! Html::style('css/custom.css') !!}
        {!! React::style('app') !!}
    </head>
    <body class="hold-transition skin-purple sidebar-mini fixed">
        <div id="app-container">
        </div>
        {!! React::script('app') !!}
    </body>
</html>
