<html>
  <table>
    <thead>
      <tr>
        <th height="50" align="center" valign="middle">Meno</th>
        <th height="50" align="center" valign="middle">Priezvisko</th>
        <th height="50" align="center" valign="middle">Email</th>
        <th height="50" align="center" valign="middle">Event</th>
        <th height="50" align="center" valign="middle">Dátum konania eventu</th>
        <th height="50" align="center" valign="middle">Dátum odhlásenia</th>
      </tr>
    </thead>
    <tbody>
        @foreach($attendees->groupBy('userId')->toArray() as $attendeeData)
            @foreach($attendeeData as $attendee)
            <tr>
                <td>{{ $attendee['user']['firstName'] }}</td>
                <td>{{ $attendee['user']['lastName'] }}</td>
                <td>{{ $attendee['user']['email'] }}</td>
                <td>{{ $attendee['eventName'] }}</td>
                <td>{{ $attendee['eventTerm'] }}</td>
                <td>{{ $attendee['pivot']['signedOut'] }}</td>
            </tr>
            @endforeach
        @endforeach
    </tbody>
  </table>
</html>