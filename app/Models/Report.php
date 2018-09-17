<?php namespace App\Models;

use Carbon\Carbon;
use \App\NxEvent;
use \App\Student;
use \App\Semester;
use \App\NxEventTerm;
use \App\DefaultSystemSettings;

class Report
{
    public static function getSignedDidnComeStudentsExcel($semesterId)
    {
        $events = NxEvent::where('status', 'published')->where('semesterId', $semesterId)->get();
        $attendees = collect([]);
        foreach ($events as $event) {
            $terms = $event->terms()->whereRaw('eventEndDateTime < NOW()')->get();
            foreach ($terms as $term) {
                $termAttendees = $term->attendees()->wherePivot('signedIn', '!=', null)
                    ->where(function ($query) use ($term) {
                        $query->whereNull($term->attendees()->getTable().'.wasPresent');
                        $query->orWhere($term->attendees()->getTable().'.wasPresent', false);
                    })
                    ->with(['user'])
                    ->get()
                    ->map(function ($attendee) use ($event, $term) {
                        $attendee['eventName'] = $event->name;
                        $attendee['eventTerm'] = $term->eventStartDateTime->format('Y-m-d H:i');
                        return $attendee;
                    });
                $attendees->push($termAttendees);
            }
        }
        $attendees = $attendees->flatten(1);

        return \Excel::create('Zoznam prihlásených, ktorí neprišli', function ($excel) use ($attendees) {
            $excel->sheet('Študenti', function ($sheet) use ($attendees) {
                $sheet->loadView('exports.signed_didnt_come_overview', ['attendees' => $attendees]);
            });
            $excel->sheet('Dáta', function ($sheet) use ($attendees) {
                $sheet->loadView('exports.signed_didnt_come_data', ['attendees' => $attendees]);
            });
        });
    }

    public static function getLateUnsigningStudentsExcel($semesterId, $hoursBeforeEvent)
    {
        $events = NxEvent::where('status', 'published')->where('semesterId', $semesterId)->get();
        $attendees = collect([]);
        foreach ($events as $event) {
            $terms = $event->terms()->whereRaw('eventEndDateTime < NOW()')->get();
            foreach ($terms as $term) {
                $termAttendees = $term->attendees()->wherePivot('signedOut', '!=', null)
                    ->whereHas('attendeesGroup', function ($query) use ($term, $hoursBeforeEvent) {
                        $query->whereRaw(
                            $term->attendees()->getTable().'.signedOut > "'.
                            $term->eventStartDateTime->subHours($hoursBeforeEvent)->format('Y-m-d H:i:s').'"'
                        );
                    })
                    ->with(['user'])
                    ->get()
                    ->map(function ($attendee) use ($event, $term) {
                        $attendee['eventName'] = $event->name;
                        $attendee['eventTerm'] = $term->eventStartDateTime->format('Y-m-d H:i');
                        return $attendee;
                    });
                $attendees->push($termAttendees);
            }
        }

        $attendees = $attendees->flatten(1);

        return \Excel::create('Zoznam neskoro sa odhlasujúcich', function ($excel) use ($attendees) {
            $excel->sheet('Študenti', function ($sheet) use ($attendees) {
                $sheet->loadView('exports.late_unsigning_overview', ['attendees' => $attendees]);
            });
            $excel->sheet('Dáta', function ($sheet) use ($attendees) {
                $sheet->loadView('exports.late_unsigning_data', ['attendees' => $attendees]);
            });
        });
    }

    public static function getStudentSemesterPointsExcel($studentId)
    {
        $student = Student::findOrFail($studentId);
        $semesters = $student->semesters;

        $data = [];
        foreach ($semesters as $semester) {
            $points = $student->user->computeActivityPoints($semester->id);
            $basePoints = $semester->pivot->activityPointsBaseNumber;

            // list of student`s level events which he/she missed
            $events = NxEvent::where('semesterId', $semester->id)
                             ->where('status', 'published')
                             ->whereDoesntHave('terms', function ($query) {
                                 $query->whereRaw('eventEndDateTime > NOW()');
                             })
                             ->get();

            $missedEvents = collect([]);
            $signedDidNotCome = collect([]);
            foreach ($events as $event) {
                $attendee = $event->attendees()
                               ->where('nx_event_attendees.userId', $student->user->id)
                               ->first();

                $isLevelEvent = $event->curriculumLevelId === $semester->pivot->studentLevelId;
                if ($isLevelEvent && $attendee && !$attendee->wasPresent) {
                    $missedEvents->push($event->name);
                }

                if ($attendee && !$attendee->wasPresent && $attendee->signedIn) {
                    $signedDidNotCome->push($event->name);
                }
            }

            $data[] = [
                'semesterName' => $semester->name,
                'gainedPointsPercentage' => $points['sumGainedPoints'] / $basePoints * 100,
                'missedEvents' => $missedEvents,
                'signedDidNotCome' => $signedDidNotCome,
            ];
        }

        return \Excel::create('Prehľad bodov študenta', function ($excel) use ($data, $student) {
            $excel->sheet('Semestre', function ($sheet) use ($data, $student) {
                $sheet->loadView('exports.student_semesters_points', [
                    'semesters' => $data,
                    'studentName' => $student->firstName.' '.$student->lastName,
                ]);
            });
        });
    }

    public static function getStudentsSemesterPointsExcel($semesterId)
    {
        $students = Student::all();

        $data = [];
        foreach ($students as $student) {
            $semester = $student->semesters()
                                ->where('semesterId', $semesterId)
                                ->first();
            if (!$semester) {
                continue;
            }

            $points = $student->user->computeActivityPoints($semester->id);
            $basePoints = $semester->pivot->activityPointsBaseNumber;

            $data[] = [
                'firstName' => $student->firstName,
                'lastName' => $student->lastName,
                'email' => $student->user->email,
                'gainedPointsPercentage' => $basePoints ? $points['sumGainedPoints'] / $basePoints * 100 : null,
                'basePoints' => $basePoints,
                'minimumSemesterActivityPoints' => $semester->pivot->minimumSemesterActivityPoints,
                'gainedPoints' => $points['sumGainedPoints'],
                'level' => $student->level->name,
                'possiblePoints' => $points['sumPossibleMissedPoints'],
            ];
        }

        return \Excel::create('Prehľad bodov študentov', function ($excel) use ($data, $student) {
            $excel->sheet('Data', function ($sheet) use ($data, $student) {
                $sheet->loadView('exports.students_active_semesters_points', [
                    'data' => $data,
                ]);
            });
        });
    }

    public static function getStudentsActiveSemesterAttendance()
    {
        $semester = Semester::where('id', DefaultSystemSettings::get('activeSemesterId'))->first();

        $eventIds = NxEvent::where('semesterId', $semester->id)
            ->where('status', 'published')
            ->whereDoesntHave('terms', function ($query) {
                $query->whereRaw('eventEndDateTime > NOW()');
            })
            ->pluck('id');

        $termAttendees = NxEventTerm::whereIn('eventId', $eventIds)
            ->join('nx_event_attendees_nx_event_terms', 'termId', '=', 'nx_event_terms.id')
            ->join('nx_event_attendees', 'attendeeId', '=', 'nx_event_attendees.id')
            ->join('nx_events', 'nx_events.id', '=', 'eventId')
            ->join('students', 'students.userId', '=', 'nx_event_attendees.userId')
            ->join('semester_student', 'semester_student.studentId', '=', 'students.id')
            ->join('student_levels', 'student_levels.id', '=', 'semester_student.studentLevelId')
            ->where('semester_student.semesterId', DefaultSystemSettings::get('activeSemesterId'))
            ->whereNull('nx_event_attendees.deleted_at')
            ->select([
                'nx_events.name as eventName',
                'nx_event_attendees_nx_event_terms.wasPresent',
                'nx_event_attendees_nx_event_terms.filledFeedback',
                'nx_event_attendees_nx_event_terms.signedIn',
                'nx_event_attendees_nx_event_terms.standIn',
                'nx_event_attendees_nx_event_terms.signedOut',
                'nx_event_attendees_nx_event_terms.wontGo',
                'students.firstName',
                'students.lastName',
                'student_levels.name as levelName',
                'nx_event_terms.eventStartDateTime',
            ])->get();

        return \Excel::create('Prehľad účasti študentov', function ($excel) use ($termAttendees) {
            $excel->sheet('Data', function ($sheet) use ($termAttendees) {
                $sheet->loadView('exports.students_active_semesters_attendance', [
                    'data' => $termAttendees,
                ]);
            });
        });
    }
}
