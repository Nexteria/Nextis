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
      </tr>
    </thead>
    <tbody>
        @foreach($users as $user)
        <tr>
            <td>{{ $user->firstName }}</td>
            <td>{{ $user->lastName }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->student ? $user->student->level->name : '' }}</td>
            <td>{{ $user->dateOfBirth ? $user->dateOfBirth->age : '' }}</td>
            <td>{{ $user->school }}</td>
            <td>{{ $user->studyProgram }}</td>
            <td>{{ $user->studyYear }}</td>
            <td>{{ $user->actualJobInfo }}</td>
        </tr>
        @endforeach
    </tbody>
  </table>
</html>