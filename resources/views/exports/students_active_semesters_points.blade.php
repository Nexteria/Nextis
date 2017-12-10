<html>
  <table>
    <thead>
        <tr>
            <th height="50" align="center" valign="middle">Meno</th>
            <th height="50" align="center" valign="middle">Priezvisko</th>
            <th height="50" align="center" valign="middle">Email</th>
            <th height="50" align="center" valign="middle">Level</th>
            <th height="50" align="center" valign="middle">% získaných bodov (100% = bodový základ)</th>
            <th height="50" align="center" valign="middle">Bodový základ</th>
            <th height="50" align="center" valign="middle">Bodové minimum</th>
            <th height="50" align="center" valign="middle">Získané body</th>
            <th height="50" align="center" valign="middle">Potenciálne body</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $student)
            <tr>
                <td>{{ $student['firstName'] }}</td>
                <td>{{ $student['lastName'] }}</td>
                <td>{{ $student['email'] }}</td>
                <td>{{ $student['level'] }}</td>
                <td>{{ $student['gainedPointsPercentage'] }}</td>
                <td>{{ $student['basePoints'] }}</td>
                <td>{{ $student['minimumSemesterActivityPoints'] }}</td>
                <td>{{ $student['gainedPoints'] }}</td>
                <td>{{ $student['possiblePoints'] }}</td>
            </tr>
        @endforeach
    </tbody>
  </table>
</html>