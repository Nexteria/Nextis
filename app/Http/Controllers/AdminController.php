<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\NxEvent as NxEvent;
use App\Semester;
use App\Student;

class AdminController extends Controller
{

    /**
     * @var \App\Transformers\NxEventTransformer
     */
    protected $nxEventTransformer;

    /**
     * @var \App\Transformers\NxEventsSettingsTransformer
     */
    protected $nxEventsSettingsTransformer;

    public function __construct(
        \App\Transformers\NxEventTransformer $nxEventTransformer,
        \App\Transformers\NxEventsSettingsTransformer $nxEventsSettingsTransformer
    ) {
        $this->nxEventTransformer = $nxEventTransformer;
        $this->nxEventsSettingsTransformer = $nxEventsSettingsTransformer;
    }

    public function getNxEventsCategories()
    {
        return response()->json([
          [
            'codename' => 'archived',
            'events' => NxEvent::getArchivedEvents()->pluck('id'),
            'order' => 0,
          ],
          [
            'codename' => 'drafts',
            'events' => NxEvent::getDraftEvents()->pluck('id'),
            'order' => 1,
          ],
          [
            'codename' => 'published',
            'events' => NxEvent::getPublishedEvents()->pluck('id'),
            'order' => 2,
          ],
          [
            'codename' => 'beforeSignInOpening',
            'events' => NxEvent::getBeforeSignInOpeningEvents()->pluck('id'),
            'order' => 3,
          ],
          [
            'codename' => 'afterSignInOpening',
            'events' => NxEvent::getOpenedSignInEvents()->pluck('id'),
            'order' => 4,
          ],
          [
            'codename' => 'signInClosed',
            'events' => NxEvent::getClosedSignInEvents()->pluck('id'),
            'order' => 5,
          ],
          [
            'codename' => 'waitingForFeedback',
            'events' => NxEvent::getWaitingForFeedbackEvents()->pluck('id'),
            'order' => 6,
          ],
          [
            'codename' => 'watingForEvaluation',
            'events' => NxEvent::getWaitingForEvaluationEvents()->pluck('id'),
            'order' => 7,
          ],
        ], 200);
    }

    public function getNxEvents(Request $request)
    {
        $eventIds = $request->has('eventsIds') ? $request->get('eventsIds') : [];
        $events = NxEvent::whereIn('id', $eventIds)->get();

        return response()->json($this->nxEventTransformer->transformCollection($events));
    }

    public function getSemesters($semesterId = null)
    {
        $semesters = $semesterId ? [Semester::find($semesterId)] : Semester::all();

        $results = [];
        foreach ($semesters as $semester) {
            $students = $semester->students()->where('status', 'active')->get()->map(function ($student) {
                return [
                  'id' => $student->id,
                  'levelId' => $student->pivot->studentLevelId,
                ];
            });

            $results[] = [
              'id' => $semester->id,
              'name' => $semester->name,
              'startDate' => $semester->startDate->toIso8601String(),
              'endDate' => $semester->endDate->toIso8601String(),
              'events' => $semester->events()->where('status', 'published')->get()->pluck('id'),
              'activeStudents' => $students,
            ];
        }

        return response()->json($results);
    }

    public function getStudents()
    {
        $students = Student::all();

        $results = [];
        foreach ($students as $student) {
            $semester = $student->getActiveSemester();
            $activityPoints = $student->user->computeActivityPoints($semester->id);

            $results[] = [
              'id' => $student->id,
              'firstName' => $student->firstName,
              'lastName' => $student->lastName,
              'studentLevelId' => $student->studentLevelId,
              'activityPointsBaseNumber' => $semester->pivot->activityPointsBaseNumber,
              'minimumSemesterActivityPoints' => $semester->minimumSemesterActivityPoints,
              'sumGainedPoints' => $activityPoints['sumGainedPoints'],
              'sumPotentialPoints' => $activityPoints['sumPotentialPoints'],
              'tuitionFeeBalance' => $student->getTuitionFeeBalance(),
              'status' => $student->status,
            ];
        }

        return response()->json($results);
    }

    public function createSemester(Request $request)
    {
        $validator = \Validator::make($request->all(), [
          'name' => 'required|min:5|max:100',
          'startDate' => 'required|date:YYYY-MM-DD HH:mm:ss',
          'endDate' => 'required|date:YYYY-MM-DD HH:mm:ss',
          'levels' => 'present',
          'levels.*.id' => 'required|numeric|min:0',
          'levels.*.tuitionFee' => 'required|numeric|min:0',
          'levels.*.activityPointsBaseNumber' => 'required|numeric|min:0',
          'levels.*.minimumSemesterActivityPoints' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $semester = Semester::create($request->all());

        foreach ($request->all()['levels'] as $level) {
            $semester->studentLevels()->attach($level['id'], [
              'tuitionFee' => $level['tuitionFee'],
              'activityPointsBaseNumber' => $level['activityPointsBaseNumber'],
              'minimumSemesterActivityPoints' => $level['minimumSemesterActivityPoints'],
            ]);
        }

        return $this->getSemesters($semester->id);
    }
}
