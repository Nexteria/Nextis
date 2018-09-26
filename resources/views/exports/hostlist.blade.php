<html>
  <head>
    <meta charset="utf-8">
    <style>
        .attendees-container td {
            border: 1px solid black;
            padding: 5px 15px;
        }
        h2, h4 {
            text-align: center;
        }
        td.no-border {
            border: 0px solid black;
        }
        .checkbox {
            width: 20px;
            height: 20px;
            border: 1px solid black;
            margin: auto;
        }
        table {
            margin: auto;
        }
    </style>
  </head>
  <body>
    <h2>{{ $eventName }}</h2>
    <h4>{{ $date }}</h4>
    <table class="attendees-container">
        <thead>
        <tr>
            <th height="50" align="center" valign="middle">#</th>
            <th height="50" align="center" valign="middle">Meno</th>
            <th height="50" align="center" valign="middle">Priezvisko</th>
            <th height="50" align="center" valign="middle">Telefón</th>
            <th height="50" align="center" valign="middle">Podpis</th>
            <th height="50" align="center" valign="middle">Príchod po začatí</th>
        </tr>
        </thead>
        <tbody>
            @foreach($attendees as $index => $attendee)
                <tr>
                    <td class="no-border">{{ $index + 1 }}</td>
                    <td>{{ $attendee->user->firstName }}</td>
                    <td>{{ $attendee->user->lastName }}</td>
                    <td>{{ str_replace(" ", "", $attendee->user->phone) }}</td>
                    <td width="150"></td>
                    <td class="no-border"><div class="checkbox"></div></td>
                </tr>
            @endforeach
        </tbody>
    </table>
  </body>
</html>