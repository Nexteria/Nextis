<html>
  <table>
    <thead>
      <tr>
        <th height="50" align="center" valign="middle">Meno</th>
        <th height="50" align="center" valign="middle">Priezvisko</th>
        <th height="50" align="center" valign="middle">Email</th>
        <th height="50" align="center" valign="middle">Počet prehreškov</th>
      </tr>
    </thead>
    <tbody>
        @foreach($attendees->groupBy('userId')->toArray() as $attendeeData)
        <tr>
            <td>{{ $attendeeData[0]['user']['firstName'] }}</td>
            <td>{{ $attendeeData[0]['user']['lastName'] }}</td>
            <td>{{ $attendeeData[0]['user']['email'] }}</td>
            <td>{{ count($attendeeData) }}</td>
        </tr>
        @endforeach
    </tbody>
  </table>
</html>