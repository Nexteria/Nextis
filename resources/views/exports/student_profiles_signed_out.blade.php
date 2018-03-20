<html>
  <table>
    <thead>
      <tr>
        <th height="50" align="center" valign="middle">Meno</th>
        <th height="50" align="center" valign="middle">Priezvisko</th>
        <th height="50" align="center" valign="middle">Email</th>
        <th height="50" align="center" valign="middle">Nexteria level</th>
        <th height="50" align="center" valign="middle">Vek</th>
        <th height="50" align="center" valign="middle">Škola</th>
        <th height="50" align="center" valign="middle">Štúdijný program</th>
        <th height="50" align="center" valign="middle">Rok štúdia</th>
        <th height="50" align="center" valign="middle">Informácia o aktuálnej pracovnej pozícií</th>
        <th height="50" align="center" valign="middle">Dátum odhlásenia</th>
        <th height="50" align="center" valign="middle">Dôvod odhlásenia</th>
      </tr>
    </thead>
    <tbody>
        @foreach($attendees as $attendee)
        <tr>
            <td>{{ $attendee->user->firstName }}</td>
            <td>{{ $attendee->user->lastName }}</td>
            <td>{{ $attendee->user->email }}</td>
            <td>{{ $attendee->user->student ? $attendee->user->student->level->name : '' }}</td>
            <td>{{ $attendee->user->dateOfBirth ? $attendee->user->dateOfBirth->age : '' }}</td>
            <td>{{ $attendee->user->school }}</td>
            <td>{{ $attendee->user->studyProgram }}</td>
            <td>{{ $attendee->user->studyYear }}</td>
            <td>{{ $attendee->user->actualJobInfo }}</td>
            <td>{{ $isTerm ? $attendee->pivot->signedOut : $attendee->signedOut }}</td>
            <td>{{ $isTerm ? $attendee->pivot->signedOutReason : $attendee->signedOutReason }}</td>
        </tr>
        @endforeach
    </tbody>
  </table>
</html>