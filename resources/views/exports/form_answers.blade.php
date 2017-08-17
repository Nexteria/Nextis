<html>
  <table>
    <thead>
      <tr>
        <th height="50" align="center" valign="middle">Meno</th>
        <th height="50" align="center" valign="middle">Priezvisko</th>
        <th height="50" align="center" valign="middle">Level</th>
        <th height="50" align="center" valign="middle">Email</th>
        @foreach($data['questions'] as $question)
          <th height="50" align="center" valign="middle">{{ $question['title'] }}</th>
        @endforeach
      </tr>
    </thead>
    <tbody>
      @foreach($data['users'] as $user)
        <tr>
          <td>{{ $user['firstName'] }}</td>
          <td>{{ $user['lastName'] }}</td>
          <td>{{ $user['level'] }}</td>
          <td>{{ $user['email'] }}</td>
          @foreach($data['questions'] as $question)
            <td>{{ isset($user['answers'][$question['id']]) ? $user['answers'][$question['id']] : '' }}</td>
          @endforeach
        </tr>
      @endforeach
    </tbody>
  </table>
</html>