<html>
  <table>
    <thead>
        <tr>
            <th align="center" valign="middle" colspan="4">{{ $studentName }}</th>
        </tr>
        <tr>
            <th height="50" align="center" valign="middle"></th>
            <th height="50" align="center" valign="middle">% získaných bodov (100% = bodový základ)</th>
            <th height="50" align="center" valign="middle">Vynechané levelové aktivity</th>
            <th height="50" align="center" valign="middle">Prihlásený/á ale neprišiel/la</th>
        </tr>
    </thead>
    <tbody>
        @foreach($semesters as $semester)
            <tr>
                <td>{{ $semester['semesterName'] }}</td>
                <td>{{ $semester['gainedPointsPercentage'] }}</td>
                <td>{{ $semester['missedEvents']->implode(',') }}</td>
                <td>{{ $semester['signedDidNotCome']->implode(',') }}</td>
            </tr>
        @endforeach
    </tbody>
  </table>
</html>