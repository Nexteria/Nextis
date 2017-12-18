<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Student;
use App\NxEvent;

class StudentsController extends Controller
{
    public function getStudentEventDetails($studentId, $eventId)
    {
        $student = Student::findOrFail($studentId);
        $event = NxEvent::findOrFail($eventId);

        $attendee = $event->attendees()->where('userId', $student->userId)->first();

        return response()->json($attendee);
    }

    public function getSemesterStudent($semesterId, $studentId)
    {
        $student = Student::findOrFail($studentId);

        $semester = $student->semesters()->where('semesters.id', $semesterId)->first();
        if (!$semesterId) {
            return [];
        }

        $activityPoints = $student->activityPoints()->where('semesterId', $semester->id)->get();

        return [
            'id' => $student->id,
            'userId' => $student->userId,
            'firstName' => $student->firstName,
            'lastName' => $student->lastName,
            'studentLevelId' => $student->studentLevelId,
            'activityPointsBaseNumber' => $semester->pivot->activityPointsBaseNumber,
            'minimumSemesterActivityPoints' => $semester->minimumSemesterActivityPoints,
            'sumGainedPoints' => $activityPoints->sum('gainedPoints'),
            'sumPotentialPoints' => 0,
            'activityPoints' => $activityPoints,
            'tuitionFeeBalance' => $student->getTuitionFeeBalance(),
            'status' => $student->status,
        ];
    }
}
