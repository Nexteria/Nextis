<html>
  <table>
    <thead>
      <tr>
        <th>Meno a Priezvisko</th>
        <th>Level</th>
        <th>Mal zaplatiť</th>
        <th>Zaplatil</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($levels as $key => $level)
        @foreach ($level['students'] as $student)
          <tr>
            <td>{{ $student['name'] }}</td>
            <td>{{ $level['name'] }}</td>
            <td>{{ $student['debetPaymentsSum'] }}</td>
            <td>{{ $student['kreditPaymentsSum'] }}</td>
          </tr>
        @endforeach
        <tr>
          <td></td>
          <td></td>
          <td>{{ $level['debetTotal'] }}</td>
          <td>{{ $level['kreditTotal'] }}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      @endforeach
    </tbody>
  </table>
</html>