<html>
  <table>
    <thead>
        <tr>
            <th height="50" align="center" valign="middle">Meno</th>
            <th height="50" align="center" valign="middle">Priezvisko</th>
            <th height="50" align="center" valign="middle">Level</th>
            <th height="50" align="center" valign="middle">Názov eventu</th>
            <th height="50" align="center" valign="middle">Bol prítomný</th>
            <th height="50" align="center" valign="middle">Vyplnil feedback</th>
            <th height="50" align="center" valign="middle">Prihlásený</th>
            <th height="50" align="center" valign="middle">Odhlásený</th>
            <th height="50" align="center" valign="middle">Nepríde</th>
            <th height="50" align="center" valign="middle">Náhradník</th>
            <th height="50" align="center" valign="middle">Začiatok stretnutia</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $attendee)
            <tr>
                <td>{{ $attendee->firstName }}</td>
                <td>{{ $attendee->lastName }}</td>
                <td>{{ $attendee->levelName }}</td>
                <td>{{ $attendee->eventName }}</td>
                <td>{{ $attendee->wasPresent }}</td>
                <td>{{ $attendee->filledFeedback }}</td>
                <td>{{ $attendee->signedIn }}</td>
                <td>{{ $attendee->signedOut }}</td>
                <td>{{ $attendee->wontGo }}</td>
                <td>{{ $attendee->standIn }}</td>
                <td>{{ $attendee->eventStartDateTime }}</td>
            </tr>
        @endforeach
    </tbody>
  </table>
</html>