@foreach ($students as $student)
BEGIN:VCARD
VERSION:3.0
FN:{{ $student->user->firstName.' '.$student->user->lastName }}
N:{{ $student->user->lastName }};{{ $student->user->firstName }};;;
EMAIL;TYPE=INTERNET:{{ $student->user->email }}
TEL;TYPE=CELL:{{ $student->user->phone }}
NOTE:NEXTERIA, NLA {{ $student->startingYear }}
END:VCARD
@endforeach