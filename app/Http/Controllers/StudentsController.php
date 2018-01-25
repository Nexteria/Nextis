<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Student;
use App\NxEvent;
use App\Models\ActivityPoints;

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

    public function deleteActivityPoints($studentId, $activityPointsId)
    {
        $points = ActivityPoints::where('id', $activityPointsId)->where('studentId', $studentId)->first();
        $points->delete();

        return response()->json();
    }

    public function updateGuidesOption(Request $request, $optionId)
    {
        $student = Student::where('userId', \Auth::user()->id)->first();
        $option = $student->guidesOptions()->wherePivot('id', '=', $optionId)->first();

        $data = [
            'priority' => intval($request->get('priority')),
            'whyIWouldChooseThisGuide' => $request->get('whyIWouldChooseThisGuide'),
            'updated_at' => Carbon::now(),
        ];

        if ($data['priority'] !== "-1" && $student->guidesOptions()->wherePivot('priority', '=', $data['priority'])->exists()) {
            return response()->json(['error' => 'Nie je možné priradiť rovnakú prioritu'], 400);
        }

        $student->guidesOptions()->updateExistingPivot($option->pivot->guideId, $data);

        return response()->json($student->fresh()->guidesOptions);
    }
}
