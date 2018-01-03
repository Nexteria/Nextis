<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\NxEvent as NxEvent;
use App\Semester;
use App\Student;
use App\StudentLevel;
use App\NxEventAttendee;
use App\NxEventTerm;
use App\User;
use App\Role;
use App\DefaultSystemSettings;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Comment;
use App\Models\ActivityPoints;
use App\Models\Report;
use App\Models\QuestionForm\Form;
use App\Models\QuestionForm\Answer;
use App\Models\QuestionForm\Question;
use App\Models\QuestionForm\Choice;

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

    /**
     * @var \App\Transformers\CommentsTransformer
     */
    protected $commentsTransformer;

    public function __construct(
        \App\Transformers\NxEventTransformer $nxEventTransformer,
        \App\Transformers\NxEventsSettingsTransformer $nxEventsSettingsTransformer,
        \App\Transformers\CommentsTransformer $commentsTransformer
    ) {
        $this->nxEventTransformer = $nxEventTransformer;
        $this->nxEventsSettingsTransformer = $nxEventsSettingsTransformer;
        $this->commentsTransformer = $commentsTransformer;
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
              'startDate' => $semester->startDate->toDateTimeString(),
              'endDate' => $semester->endDate->toDateTimeString(),
              'events' => $semester->events()->where('status', 'published')->get()->pluck('id'),
              'activeStudents' => $students,
              'signedOutStudentsCount' => $semester->getSignedOutStudentsCount(),
              'didNotComeStudentsCount' => $semester->getDidNotComeStudentsCount(),
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
            $activityPoints = $student->activityPoints()->where('semesterId', $semester->id)->get();

            $results[] = [
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

    public function assignSemester(Request $request, $semesterId)
    {
        $validator = \Validator::make($request->all(), [
          'semesterId' => 'required|numeric',
          'tuitionFee' => 'required_unless:useDefaultTuitionFee,true|numeric|min:0',
          'activityPointsBaseNumber' => 'required_unless:useDefaultActivityPointsBaseNumber,true|numeric|min:0',
          'minimumSemesterActivityPoints' => 'required_unless:useDefaultMinimumSemesterActivityPoints,true|numeric|min:0',
          'selectedStudents' => 'required|min:1',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $semester = Semester::findOrFail($semesterId);
        $data = $request->all();
        $defaultFlags = [
            'useDefaultTuitionFee',
            'useDefaultActivityPointsBaseNumber',
            'useDefaultMinimumSemesterActivityPoints'
        ];
        foreach ($defaultFlags as $flag) {
            if (!isset($data[$flag])) {
                $data[$flag] = false;
            }
        }

        $studentsCount = Student::whereIn('id', $data['selectedStudents'])
                                ->whereHas('semesters', function ($query) use ($semesterId) {
                                    $query->where('semesterId', $semesterId);
                                })
                                ->count();
        if ($studentsCount > 0) {
            return response()->json(['error' => 'Nemôžem aplikovať zmenu, niektorí študenti už majú priradený daný semester!'], 400);
        }

        if ($data['useDefaultTuitionFee'] === true ||
            $data['useDefaultActivityPointsBaseNumber'] === true ||
            $data['useDefaultMinimumSemesterActivityPoints'] === true ) {
            $studentsCount = Student::whereIn('id', $data['selectedStudents'])
                                    ->whereHas('semesters', function ($query) {
                                        $query->where('semesterId', DefaultSystemSettings::get('activeSemesterId'));
                                    })
                                    ->count();

            if ($studentsCount !== count($data['selectedStudents'])) {
                return response()->json(['error' => 'Nemôžem aplikovať študentove aktuálne hodnoty, pretože niektorý nemajú žiadne.'], 400);
            }
        }

        foreach ($data['selectedStudents'] as $studentId) {
            $student = Student::findOrFail($studentId);
            $studentActiveSemester = $student->getActiveSemester();
            $studentData = [
              'studentLevelId' => $student->studentLevelId,
            ];

            if ($data['useDefaultTuitionFee'] === true) {
                $studentData['tuitionFee'] = $studentActiveSemester->pivot->tuitionFee;
            } else {
                $studentData['tuitionFee'] = $data['tuitionFee'];
            }

            if ($data['useDefaultActivityPointsBaseNumber'] === true) {
                $studentData['activityPointsBaseNumber'] = $studentActiveSemester->pivot->activityPointsBaseNumber;
            } else {
                $studentData['activityPointsBaseNumber'] = $data['activityPointsBaseNumber'];
            }

            if ($data['useDefaultMinimumSemesterActivityPoints'] === true) {
                $studentData['minimumSemesterActivityPoints'] = $studentActiveSemester->pivot->minimumSemesterActivityPoints;
            } else {
                $studentData['minimumSemesterActivityPoints'] = $data['minimumSemesterActivityPoints'];
            }

            $semester->students()->attach($studentId, $studentData);
        }
    }

    public function changeActivityPoints(Request $request)
    {
        $validator = \Validator::make($request->all(), [
          'activityPointsBaseNumber' => 'required|numeric|min:0',
          'minimumSemesterActivityPoints' => 'required|numeric|min:0',
          'selectedStudents' => 'required|min:1',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $data = $request->all();

        $studentsCount = Student::whereIn('id', $data['selectedStudents'])
                                ->whereHas('semesters', function ($query) {
                                    $query->where('semesterId', DefaultSystemSettings::get('activeSemesterId'));
                                })
                                ->count();

        if ($studentsCount !== count($data['selectedStudents'])) {
            return response()->json(['error' => 'Nemôžem aplikovať nové body, niektorí študenti nemajú priradený aktuálny semester.'], 400);
        }

        $semester = Semester::find(DefaultSystemSettings::get('activeSemesterId'));
        foreach ($data['selectedStudents'] as $studentId) {
            $student = Student::findOrFail($studentId);
            $studentActiveSemester = $student->getActiveSemester();
            $studentData = [
                'activityPointsBaseNumber' => $data['activityPointsBaseNumber'],
                'minimumSemesterActivityPoints' => $data['minimumSemesterActivityPoints'],
            ];

            $semester->students()->updateExistingPivot($studentId, $studentData);
        }

        return $this->getStudents();
    }

    public function endSchoolYear()
    {
        $firstLevel = \App\StudentLevel::where('codename', '1_level')->first();
        $secondLevel = \App\StudentLevel::where('codename', '2_level')->first();
        $thirdLevel = \App\StudentLevel::where('codename', '3_level')->first();
        $alumniLevel = \App\StudentLevel::where('codename', 'alumni_level')->first();

        foreach ($thirdLevel->students()->where('status', 'active')->get() as $student) {
            $thirdLevel->userGroup->users()->detach($student->userId);
            if (!$alumniLevel->userGroup->users->contains($student->userId)) {
                $alumniLevel->userGroup->users()->attach($student->userId);
            }
            $student->studentLevelId = $alumniLevel->id;
            $student->save();
        }

        foreach ($secondLevel->students()->where('status', 'active')->get() as $student) {
            $secondLevel->userGroup->users()->detach($student->userId);
            if (!$thirdLevel->userGroup->users->contains($student->userId)) {
                $thirdLevel->userGroup->users()->attach($student->userId);
            }
            $student->studentLevelId = $thirdLevel->id;
            $student->save();
        }

        foreach ($firstLevel->students()->where('status', 'active')->get() as $student) {
            $firstLevel->userGroup->users()->detach($student->userId);
            if (!$secondLevel->userGroup->users->contains($student->userId)) {
                $secondLevel->userGroup->users()->attach($student->userId);
            }
            $student->studentLevelId = $secondLevel->id;
            $student->save();
        }

        return $this->getStudents();
    }

    public function getNewStudentsImportTemplate()
    {
        return \Excel::create('Import novoprijatých študentov', function ($excel) {
            $statuses = Student::groupBy('status')
                                ->pluck('status')
                                ->toArray();

            $excel->sheet('Študenti', function ($sheet) use ($statuses) {
                $sheet->loadView('exports.example_new_students_import');

                $objValidation = $sheet->getCell('F2')->getDataValidation();
                $objValidation->setType(\PHPExcel_Cell_DataValidation::TYPE_LIST);
                $objValidation->setShowDropDown(true);
                $objValidation->setAllowBlank(false);
                $objValidation->setShowInputMessage(true);
                $objValidation->setShowDropDown(true);
                $objValidation->setPromptTitle('Pick from list');
                $objValidation->setPrompt('Please pick a value from the drop-down list.');
                $objValidation->setErrorTitle('Input error');
                $objValidation->setError('Value is not in list');
                $objValidation->setFormula1('"'.implode(',', $statuses).'"');

                $objValidation = $sheet->getCell('G2')->getDataValidation();
                $objValidation->setType(\PHPExcel_Cell_DataValidation::TYPE_LIST);
                $objValidation->setShowDropDown(true);
                $objValidation->setAllowBlank(false);
                $objValidation->setShowInputMessage(true);
                $objValidation->setShowDropDown(true);
                $objValidation->setPromptTitle('Pick from list');
                $objValidation->setPrompt('Please pick a value from the drop-down list.');
                $objValidation->setErrorTitle('Input error');
                $objValidation->setError('Value is not in list');
                $objValidation->setFormula1('"yes,no"');
            });
        })->download('xls');
    }

    public function importNewStudentsFromExcel()
    {
        $reader = \Excel::load(\Input::file('file'));
        $students = $reader->toArray();

        $rowFields = [
            'menopovinne',
            'priezviskopovinne',
            'uzivatelske_menonepovinne_vygeneruje_sa',
            'emailpovinne',
            'telefonpovinne',
            'stavpovinne',
            'heslonepovinne_vygeneruje_sa',
            'skolanepovinne',
            'studijny_programnepovinne',
            'fakultanepovinne',
            'rok_studianepovinne',
            'odoslat_welcome_emailpovinne',
        ];

        $statuses = Student::groupBy('status')
                                ->pluck('status')
                                ->toArray();
        foreach ($students as $student) {
            $validator = \Validator::make($student, [
                'menopovinne' => 'required|alpha|min:2',
                'priezviskopovinne' => 'required|alpha|min:2',
                'uzivatelske_menonepovinne_vygeneruje_sa' => 'nullable|string',
                'emailpovinne' => 'required|email',
                'telefonpovinne' => 'required|phone:AUTO',
                'stavpovinne' => 'required|in:'.implode(',', $statuses),
                'heslonepovinne_vygeneruje_sa' => 'nullable|string|min:5',
                'skolanepovinne' => 'nullable|string',
                'menopstudijny_programnepovinneovinne' => 'nullable|string',
                'fakultanepovinne' => 'nullable|string',
                'rok_studianepovinne' => 'nullable|numeric|min:1|max:10',
                'odoslat_welcome_emailpovinne' => 'required|in:yes,no',
            ]);

            if ($validator->fails()) {
                $messages = '';
                foreach (json_decode($validator->messages()) as $message) {
                    $messages .= ' '.implode(' ', $message);
                }

                return response()->json(['error' => $messages], 400);
            }

            $username = $student['uzivatelske_menonepovinne_vygeneruje_sa'];
            if ($username) {
                $isUsernameUsed = User::where('username', $username)
                                       ->exists();
                if ($isUsernameUsed) {
                    return response()->json(['error' => 'Username: '.$username.' is already used!'], 400);
                }
            }

            $email = $student['emailpovinne'];
            if ($email) {
                $isEmailUsed = User::where('email', $email)
                                       ->exists();
                if ($isEmailUsed) {
                    return response()->json(['error' => 'Email: '.$email.' is already used!'], 400);
                }
            }

            $phone = $student['telefonpovinne'];
            if ($phone) {
                $isPhoneUsed = User::where('phone', $phone)
                                       ->exists();
                if ($isPhoneUsed) {
                    return response()->json(['error' => 'Phone: '.$phone.' is already used!'], 400);
                }
            }
        }

        foreach ($students as $student) {
            # vytvori sa user
            $userData = [
                'firstName' => $student['menopovinne'],
                'lastName' => $student['priezviskopovinne'],
                'email' => $student['emailpovinne'],
                'phone' => $student['telefonpovinne'],
                'username' => '',
                'school' => '',
                'studyProgram' => '',
                'faculty' => '',
                'studyYear' => '',
                'state' => 'active',
            ];

            if (isset($student['menopstudijny_programnepovinneovinne'])) {
                $userData['studyProgram'] = $student['menopstudijny_programnepovinneovinne'];
            }

            if (isset($student['skolanepovinne'])) {
                $userData['school'] = $student['skolanepovinne'];
            }

            if (isset($student['fakultanepovinne'])) {
                $userData['faculty'] = $student['fakultanepovinne'];
            }

            if (isset($student['rok_studianepovinne'])) {
                $userData['studyYear'] = $student['rok_studianepovinne'];
            }

            if (isset($student['uzivatelske_menonepovinne_vygeneruje_sa'])) {
                $userData['username'] = $student['uzivatelske_menonepovinne_vygeneruje_sa'];
            } else {
                $username = Str::ascii(Str::lower($userData['firstName'])).'.'.Str::ascii(Str::lower($userData['lastName']));
                $index = 1;
                while (User::where('username', $username)->exists()) {
                    $username = Str::ascii(Str::lower($userData['firstName'])).'.'.Str::ascii(Str::lower($userData['lastName'])).$index;
                    $index++;
                }
                $userData['username'] = $username;
            }

            $password = Str::random(12);
            if ($student['heslonepovinne_vygeneruje_sa']) {
                $password = $student['heslonepovinne_vygeneruje_sa'];
            }

            $user = User::create($userData);
            $user->password = \Hash::make($password);
            $user->roles()->sync(Role::where('name', 'STUDENT')->pluck('id'));
            $user->save();

            # vytvori sa student
            $level = StudentLevel::where('codename', '0_level')->first();

            $studentData = [
                'firstName' => $student['menopovinne'],
                'lastName' => $student['priezviskopovinne'],
                'status' => $student['stavpovinne'],
                'tuitionFeeVariableSymbol' => Carbon::now()->format("Ym").$user->id,
                'studentLevelId' => $level->id,
                'userId' => $user->id,
            ];

            $studentModel = Student::create($studentData);

            $level->userGroup->users()->attach($user->id);

            # priradime studentovi aktualny semester
            $semester = Semester::find(DefaultSystemSettings::get('activeSemesterId'));
            $semester->students()->attach($studentModel->id, [
                'tuitionFee' => 0,
                'activityPointsBaseNumber' => 0,
                'minimumSemesterActivityPoints' => 0,
                'studentLevelId' => $level->id,
            ]);

            if ($student['odoslat_welcome_emailpovinne'] === 'yes') {
                $email = new \App\Mail\NewStudentsWelcome($user->email, $studentData['firstName'], $password);
                \Mail::send($email);
            }
        }

        return $this->getStudents();
    }

    public function changeStudentLevel(Request $request)
    {
        $levels = StudentLevel::all()->pluck('id')->toArray();
        $validator = \Validator::make($request->all(), [
          'studentLevelId' => 'required|in:'.implode(',', $levels),
          'selectedStudents' => 'required|min:1',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $data = $request->all();
        foreach ($data['selectedStudents'] as $studentId) {
            $student = Student::findOrFail($studentId);

            # detach student from old level group
            $level = StudentLevel::find($student->studentLevelId);
            $level->userGroup->users()->detach($student->userId);

            # change student level
            $student->studentLevelId = $data['studentLevelId'];
            $student->save();

            # change student active semester level
            $semester = $student->getActiveSemester();
            $semester->pivot->studentLevelId = $data['studentLevelId'];
            $semester->pivot->save();

            # attach student to new level group
            $level = StudentLevel::find($data['studentLevelId']);
            $level->userGroup->users()->attach($student->userId);
        }

        return $this->getStudents();
    }

    public function changeTuitionFee(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'newFeeValue' => 'required|numeric',
            'selectedStudents' => 'required|min:1',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $data = $request->all();
        foreach ($data['selectedStudents'] as $studentId) {
            $student = Student::findOrFail($studentId);

            # change student tuition fee
            $semester = $student->getActiveSemester();
            $semester->pivot->tuitionFee = floatval($data['newFeeValue']) * 100;
            $semester->pivot->save();
        }

        return $this->getStudents();
    }

    public function createStudentComment(Request $request, $studentId)
    {
        $validator = \Validator::make($request->all(), [
          'commentBody' => 'required|string|min:2',
          'commentTitle' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $student = Student::findOrFail($studentId);

        $message = clean($request->get('commentBody'));
        $comment = $student->comment([
            'title' => $request->get('commentTitle'),
            'body' => $message,
        ], \Auth::user());

        return response()->json($this->commentsTransformer->transform($comment));
    }

    public function createBulkStudentsComment(Request $request)
    {
        $studentIds = $request->get('studentIds');
        foreach ($studentIds as $studentId) {
            $student = Student::findOrFail($studentId);

            $message = clean($request->get('commentBody'));
            $comment = $student->comment([
                'title' => $request->get('commentTitle'),
                'body' => $message,
            ], \Auth::user());
        }

        return response()->json('');
    }

    public function getStudentComments(Request $request, $studentId)
    {
        $student = Student::findOrFail($studentId);

        return response()->json($this->commentsTransformer->transformCollection($student->comments));
    }

    public function createComment(Request $request, $commentId)
    {
        $validator = \Validator::make($request->all(), [
          'text' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $comment = Comment::findOrFail($commentId);

        $commentableType = $comment->commentable_type;
        $commentable = call_user_func([$commentableType, 'findOrFail'], $comment->commentable_id);

        $data = [
            'title' => '',
            'body' => $request->get('text'),
        ];
        $newComment = $commentable->comment($data, \Auth::user(), $comment);

        return response()->json($this->commentsTransformer->transform($newComment));
    }

    public function deleteComment(Request $request, $commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $comment->delete();

        return response()->json('');
    }

    public function updateComment(Request $request, $commentId)
    {
        $comment = Comment::findOrFail($commentId);

        $comment->title = $request->get('title');
        $comment->body = clean($request->get('body'));
        $comment->save();

        return response()->json($this->commentsTransformer->transform($comment));
    }

    public function exportStudentProfiles(Request $request)
    {
        $userIds = Student::whereIn('id', $request->get('studentIds'))
                          ->pluck('userId');

        return \Excel::create('Export profilov študentov', function ($excel) use ($userIds) {
            $data = User::whereIn('id', $userIds)
                        ->get();

            $excel->sheet('Študenti', function ($sheet) use ($data) {
                $sheet->loadView('exports.student_profiles', ['users' => $data]);
            });
        })->download('xls');
    }

    public function getFormResults($formId)
    {
        $form = Form::findOrFail($formId);
        
        $result = [];
        foreach ($form->getUsersAnswers() as $answer) {
            $question = $answer->getQuestion();
            if (isset($result[$question->id])) {
                if (isset($result[$question->id][$answer->choiceId])) {
                    $result[$question->id][$answer->choiceId][] = [
                        'userId' => $answer->userId,
                        'answer' => $answer->answer,
                    ];
                } else {
                    $result[$question->id][$answer->choiceId] = [[
                        'userId' => $answer->userId,
                        'answer' => $answer->answer,
                    ]];
                }
            } else {
                $result[$question->id] = [];
                $result[$question->id][$answer->choiceId] = [[
                    'userId' => $answer->userId,
                    'answer' => $answer->answer,
                ]];
            }
        }

        return $result;
    }

    public function getFormAnswers($formId)
    {
        $form = Form::findOrFail($formId);
        $data = [
            'questions' => [],
            'users' => [],
        ];

        foreach ($form->questions as $question) {
            $data['questions'][$question->order] = [
                'title' => $question->question,
                'id' => $question->id,
            ];

            foreach ($question->choices as $choice) {
                foreach ($choice->answers as $answer) {
                    $user = \App\User::find($answer->userId);
                    if (!isset($data['users'][$answer->userId])) {
                        $data['users'][$answer->userId] = [
                            'answers' => [],
                            'email' => $user->email,
                            'firstName' => $user->firstName,
                            'lastName' => $user->lastName,
                            'level' => $user->student->level->name,
                        ];
                    }

                    if (!isset($data['users'][$answer->userId]['answers'][$question->id])) {
                        if ($question->type != 'shortText' && $question->type != 'longText') {
                            if ($answer->answer == 'selected') {
                                $data['users'][$answer->userId]['answers'][$question->id] = $choice->title;
                            }
                        } else {
                            $data['users'][$answer->userId]['answers'][$question->id] = $answer->answer;
                        }
                    } else {
                        if ($question->type != 'shortText' && $question->type != 'longText') {
                            if ($answer->answer == 'selected') {
                                $data['users'][$answer->userId]['answers'][$question->id] .= ', '.$choice->title;
                            }
                        } else {
                            $data['users'][$answer->userId]['answers'][$question->id] .= ', '.$answer->answer;
                        }
                    }
                }
            }
        }

        ksort($data['questions']);

        return \Excel::create('Export odpovedí', function ($excel) use ($data) {
            $excel->sheet('Odpovede', function ($sheet) use ($data) {
                $sheet->loadView('exports.form_answers', ['data' => $data]);
            });
        })->download('xls');
    }

    public function getEventAttendeesList($eventId, $type)
    {
        return $this->getTermAttendeesList($eventId, null, $type);
    }

    public function getTermAttendeesList($eventId, $termId, $type)
    {
        $event = NxEvent::findOrFail($eventId);

        if ($termId) {
            $term = $event->terms()->where('id', $termId)->first();
            $attendees = $term->attendees()->whereNotNull($term->attendees()->getTable().'.'.$type)->get();
        } else {
            $attendees = $event->attendees()->whereNotNull($type)->get();
        }

        $users = [];
        foreach ($attendees as $attendee) {
            $users[] = $attendee->user;
        }

        return \Excel::create('Export profilov študentov', function ($excel) use ($users) {
            $excel->sheet('Študenti', function ($sheet) use ($users) {
                $sheet->loadView('exports.student_profiles', ['users' => $users]);
            });
        })->download('xls');
    }

    public function getStudentsReports(Request $request, $reportType)
    {
        $report = null;
        switch ($reportType) {
            case 'signed-didnt-come':
                $report = Report::getSignedDidnComeStudentsExcel();
                break;

            case 'late-unsigning':
                $hoursBeforeEvent = $request->get('hoursBeforeEvent');
                $report = Report::getLateUnsigningStudentsExcel($hoursBeforeEvent);
                break;
            
            case 'student-semesters-points':
                $studentId = $request->get('studentId');
                $report = Report::getStudentSemesterPointsExcel($studentId);
                break;
            
            case 'students-active-semester-points':
                $report = Report::getStudentsActiveSemesterPointsExcel();
                break;
        }

        return $report->download('xls');
    }

    public function addActivityPoints(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'semesterId' => 'required|numeric',
            'activityType' => 'required|string|min:1',
            'gainedPoints' => 'required|numeric|min:0',
            'maxPossiblePoints' => 'required|numeric|min:0',
            'name' => 'required|string|min:0',
            'selectedStudents' => 'required|min:1',
            'notes' => 'string',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $points = [];
        foreach ($request->get('selectedStudents') as $studentId) {
            $data = [
                'gainedPoints' => $request->get('gainedPoints'),
                'maxPossiblePoints' => $request->get('maxPossiblePoints'),
                'studentId' => $studentId,
                'semesterId' => $request->get('semesterId'),
                'activityName' => $request->get('name'),
                'activityType' => $request->get('activityType'),
                'note' => $request->get('note'),
                'activityModelId' => null,
                'addedByUserId' => \Auth::user()->id,
            ];

            if ($request->get('activityType') === 'event') {
                $data['activityModelId'] = $request->get('activityModelId');
            }

            $points[] = ActivityPoints::create($data);
        }

        return response()->json($points);
    }

    public function changeStudentActivityPoints(Request $request, $studentId)
    {
        $validator = \Validator::make($request->all(), [
            'gainedPoints' => 'required|numeric|min:0',
            'maxPossiblePoints' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $points = ActivityPoints::where('id', $request->get('id'))->where('studentId', $studentId)->first();
        $points->gainedPoints = $request->get('gainedPoints');
        $points->maxPossiblePoints = $request->get('maxPossiblePoints');
        $points->addedByUserId = \Auth::user()->id;
        $points->save();

        return response()->json($points);
    }
}
