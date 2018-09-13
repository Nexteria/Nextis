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
        <th height="50" align="center" valign="middle">Niečo o mne</th>
        <th height="50" align="center" valign="middle">Moje ďalšie projekty / dobrovoľníctvo</th>
        <th height="50" align="center" valign="middle">Moje hobby</th>
        <th height="50" align="center" valign="middle">LinkedIn profil</th>
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
            <td>{{ $user->personalDescription }}</td>
            <td>{{ $user->otherActivities }}</td>
            <td>{{ $user->hobby }}</td>
            <td>{{ $user->linkedinLink }}</td>
        </tr>
        @endforeach
    </tbody>
  </table>
</html>