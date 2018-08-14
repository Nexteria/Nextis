<!DOCTYPE html>
<html>
    <head>
        <title>Nexteria Space</title>
        <link rel="shortcut icon" href="{{{ asset('img/favicon.ico') }}}">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <link rel="manifest" href="/manifest.json">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon.png">
        <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
        <script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jvectormap/2.0.4/jquery-jvectormap.css" media="screen"
        />
        <link rel="stylesheet" href="//cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css" media="screen" />
        <link href="https://use.fontawesome.com/releases/v5.0.7/css/all.css" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <script src=https://cdn.ravenjs.com/3.24.0/raven.min.js crossorigin=anonymous></script>

        {!! React::style('main') !!}
    </head>
    <body>
        <noscript>
        You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
        <!--
        This HTML file is a template.
        If you open it directly in the browser, you will see an empty page.

        You can add webfonts, meta tags, or analytics to this file.
        The build step will place the bundled scripts into the <body> tag.

        To begin the development, run `npm start` or `yarn start`.
        To create a production bundle, use `npm run build` or `yarn build`.
        -->
        {!! React::script('main') !!}
    </body>
</html>
