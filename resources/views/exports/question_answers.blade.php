<html>
  <table>
    <thead>
      <tr>
        <th height="50" align="center" valign="middle">Email</th>
        <th height="50" align="center" valign="middle">Odpoveď</th>
      </tr>
    </thead>
    <tbody>
        @foreach($answers as $answer)
        <tr>
            <td>{{ $answer->user->email }}</td>
            <td>{{ $answer->answer }}</td>
        </tr>
        @endforeach
    </tbody>
  </table>
</html>