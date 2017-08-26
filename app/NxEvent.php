<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

use App\User;
use App\AttendeesGroup;
use App\StudentLevel;
use App\Models\QuestionForm\Form as QuestionForm;
use App\Models\QuestionForm\FormDescription;
use App\Models\QuestionForm\Question;
use App\Models\QuestionForm\Choice;

class NxEvent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'activityPoints',
        'eventStartDateTime',
        'eventEndDateTime',
        'minCapacity',
        'maxCapacity',
        'mandatoryParticipation',
        'eventType',
        'feedbackLink',
        'status',
    ];

    protected $dateFormat = 'Y-m-d H:i:s';
    protected $dates = ['deleted_at', 'eventEndDateTime', 'eventStartDateTime'];

    public static function createNew($attributes = [])
    {
        $event = new NxEvent($attributes);
        $event->ownerId = \Auth::user()->id;
        $event->shortDescription = clean($attributes['shortDescription']);
        $event->description = clean($attributes['description']);
        $event->hostId = User::findOrFail($attributes['hostId'])->id;
        $event->nxLocationId = NxLocation::findOrFail($attributes['nxLocationId'])->id;
        $event->emailTagBase = \Uuid::generate(4);
        $event->save();

        $groupIdMap = [];
        foreach ($attributes['attendeesGroups'] as $group) {
            $newGroup = AttendeesGroup::createNew($group);
            $event->attendeesGroups()->save($newGroup);
            $groupIdMap[$group['id']] = $newGroup->id;
        }

        foreach ($attributes['lectors'] as $lector) {
            $event->lectors()->save(User::findOrFail($lector));
        }

        if (isset($attributes['curriculumLevelId'])) {
            $curriculumLevel = StudentLevel::findOrFail($attributes['curriculumLevelId']);
            $event->curriculumLevelId = $curriculumLevel->id;
        }

        if (isset($attributes['groupedEvents'])) {
            foreach ($attributes['groupedEvents'] as $eventId) {
                $event->groupedEvents()->save(NxEvent::findOrFail($eventId));
            }
        }

        if (isset($attributes['exclusionaryEvents'])) {
            foreach ($attributes['exclusionaryEvents'] as $eventId) {
                $event->exclusionaryEvents()->save(NxEvent::findOrFail($eventId));
            }
        }

        if (isset($attributes['feedbackLink'])) {
            $response = \FeedbackForms::validate($attributes['feedbackLink']);

            if ($response['code'] != 200) {
                return response()->json([
                  'code' => 500,
                  'error' => $response['error'],
                ]);
            }

            $event->publicFeedbackLink = $response['publicResponseUrl'];
        }

        if (isset($attributes['semester']) && $attributes['semester']) {
            $semester = \App\Semester::findOrFail($attributes['semester']);
            $event->semesterId = $semester->id;
        }

        if (isset($attributes['questionForm'])) {
            $attributes['questionForm']['userId'] = \Auth::user()->id;
            $form = QuestionForm::create($attributes['questionForm'])->save();

            foreach ($attributes['questionForm']['groupDescriptions'] as $id => $description) {
                $newDescription = FormDescription::create([
                    'userId' => \Auth::user()->id,
                    'description' => $description,
                    'formId' => $attributes['questionForm']['id'],
                    'attendeeGroupId' => $groupIdMap[$id],
                ]);
            }

            foreach ($attributes['questionForm']['questions'] as $questionData) {
                $questionData['userId'] = $attributes['questionForm']['userId'];
                $questionData['formId'] = $attributes['questionForm']['id'];
                $question = Question::create($questionData);

                $selection = [];
                foreach ($questionData['groupSelection'] as $key => $value) {
                    $selection[] = $groupIdMap[$key];
                }
                $question->attendeesGroups()->sync($selection);

                if ($questionData['type'] === 'shortText' || $questionData['type'] === 'longText') {
                    $choiceData = [
                        'userId' => $attributes['questionForm']['userId'],
                        'questionId' => $questionData['id'],
                        'order' => 0,
                        'title' => $questionData['question'],
                        'id' => \Uuid::generate(4),
                    ];
                    $choice = Choice::create($choiceData);
                } else {
                    foreach ($questionData['choices'] as $choiceData) {
                        $choiceData['userId'] = $attributes['questionForm']['userId'];
                        $choiceData['questionId'] = $questionData['id'];
                        $choice = Choice::create($choiceData);
                    }
                }
            }

            foreach ($attributes['questionForm']['questions'] as $questionData) {
                $question = Question::find($questionData['id']);
                foreach ($questionData['dependentOn'] as $questionOptions) {
                    foreach ($questionOptions as $oId => $option) {
                        $question->dependencies()->attach($oId);
                    }
                }
            }

            $event->signInFormId = $attributes['questionForm']['id'];
        }

        $event->save();

        return $event;
    }

    public function updateData($attributes)
    {
        $this->fill($attributes);

        $this->ownerId = \Auth::user()->id;

        if (isset($attributes['shortDescription'])) {
            $this->shortDescription = clean($attributes['shortDescription']);
        }

        if (isset($attributes['description'])) {
            $this->description = clean($attributes['description']);
        }

        if (isset($attributes['hostId'])) {
            $this->hostId = User::findOrFail($attributes['hostId'])->id;
        }

        if (isset($attributes['nxLocationId'])) {
            $this->nxLocationId = NxLocation::findOrFail($attributes['nxLocationId'])->id;
        }

        if (isset($attributes['curriculumLevelId'])) {
            $curriculumLevel = StudentLevel::findOrFail($attributes['curriculumLevelId']);
            $this->curriculumLevelId = $curriculumLevel->id;
        }

        if (isset($attributes['groupedEvents'])) {
            $this->groupedEvents()->sync(NxEvent::whereIn('id', $attributes['groupedEvents'])->pluck('id')->toArray());
        }

        if (isset($attributes['exclusionaryEvents'])) {
            $this->exclusionaryEvents()->sync(NxEvent::whereIn('id', $attributes['exclusionaryEvents'])->pluck('id')->toArray());
        }

        if (isset($attributes['lectors'])) {
            $this->lectors()->sync(User::whereIn('id', $attributes['lectors'])->pluck('id')->toArray());
        }

        $groupIdMap = [];
        if (isset($attributes['attendeesGroups'])) {
            $idsMap = [];
            foreach ($attributes['attendeesGroups'] as $group) {
                $groupModel = AttendeesGroup::find($group['id']);
                if ($groupModel) {
                    $groupModel->updatePeopleList($group);
                } else {
                    $groupModel = AttendeesGroup::createNew($group);
                    $this->attendeesGroups()->save($groupModel);
                }
                $idsMap[$groupModel->id] = true;
                $groupIdMap[$group['id']] = $groupModel->id;
            }

            $ids = $this->attendeesGroups()->pluck('id');
            foreach ($ids as $id) {
                if (!isset($idsMap[$id])) {
                    AttendeesGroup::find($id)->delete();
                }
            }
        }

        if (isset($attributes['feedbackLink'])) {
            $response = \FeedbackForms::validate($attributes['feedbackLink']);

            if ($response['code'] != 200) {
                return response()->json([
                  'code' => 500,
                  'error' => $response['error'],
                ]);
            }

            $this->publicFeedbackLink = $response['publicResponseUrl'];
        }

        if (isset($attributes['semester']) && $attributes['semester']) {
            $semester = \App\Semester::findOrFail($attributes['semester']);
            $this->semesterId = $semester->id;
        }

        if (isset($attributes['questionForm'])) {
            $attributes['questionForm']['userId'] = \Auth::user()->id;
            $form = QuestionForm::updateOrCreate(
                ['id' => $attributes['questionForm']['id']],
                $attributes['questionForm']
            );

            $groupIds = [];
            $oldGroupIds = FormDescription::where('formId', $attributes['questionForm']['id'])->pluck('attendeeGroupId');
            foreach ($attributes['questionForm']['groupDescriptions'] as $id => $description) {
                if (!isset($groupIdMap[$id])) {
                    continue;
                }

                $newDescription = FormDescription::updateOrCreate(
                    [
                        'formId' => $attributes['questionForm']['id'],
                        'attendeeGroupId' => $groupIdMap[$id],
                    ],
                    [
                        'userId' => \Auth::user()->id,
                        'description' => $description,
                        'formId' => $attributes['questionForm']['id'],
                        'attendeeGroupId' => $groupIdMap[$id],
                    ]
                );
                $groupIds[] = $groupIdMap[$id];
            }

            foreach ($oldGroupIds as $id) {
                if (!in_array($id, $groupIds)) {
                    FormDescription::where('formId', $attributes['questionForm']['id'])->where('attendeeGroupId', $id)->first()->delete();
                }
            }

            $questionsIds = [];
            foreach ($attributes['questionForm']['questions'] as $questionData) {
                $questionData['userId'] = $attributes['questionForm']['userId'];
                $questionData['formId'] = $attributes['questionForm']['id'];
                $question = Question::updateOrCreate(
                    ['id' => $questionData['id']],
                    $questionData
                );
                $questionsIds[] = $questionData['id'];

                $selection = [];
                foreach ($questionData['groupSelection'] as $key => $value) {
                    if (isset($groupIdMap[$key])){
                        $selection[] = $groupIdMap[$key];
                    }
                }
                $question->attendeesGroups()->sync($selection);

                $choiceIds = [];
                if (($questionData['type'] === 'shortText' || $questionData['type'] === 'longText') && !isset($questionData['choices'])) {
                    $choiceData = [
                        'userId' => $attributes['questionForm']['userId'],
                        'questionId' => $questionData['id'],
                        'order' => 0,
                        'title' => $questionData['question'],
                        'id' => \Uuid::generate(4),
                    ];
                    $choice = Choice::create($choiceData);
                    $choiceIds[] = $choiceData['id'];
                } else {
                    foreach ($questionData['choices'] as $choiceData) {
                        $choiceData['userId'] = $attributes['questionForm']['userId'];
                        $choiceData['questionId'] = $questionData['id'];
                        $choice = Choice::updateOrCreate(
                            ['id' => $choiceData['id']],
                            $choiceData
                        );
                        $choiceIds[] = $choiceData['id'];
                    }
                }

                Choice::where('questionId', $questionData['id'])
                      ->whereNotIn('id', $choiceIds)
                      ->delete();
            }

            Question::where('formId', $attributes['questionForm']['id'])
                  ->whereNotIn('id', $questionsIds)
                  ->delete();


            foreach ($attributes['questionForm']['questions'] as $questionData) {
                $question = Question::find($questionData['id']);
                $dependencies = [];
                foreach ($questionData['dependentOn'] as $questionOptions) {
                    foreach ($questionOptions as $oId => $option) {
                        if ($option) {
                            $dependencies[] = $oId;
                        }
                    }
                }

                $question->dependencies()->sync($dependencies);
            }

            $this->signInFormId = $attributes['questionForm']['id'];
        } else {
            if ($this->form) {
                $this->form->delete();
            }
        }

        $this->save();
    }

    public function getSettings()
    {
        $defaultSettings = \App\DefaultSystemSettings::getNxEventsSettings();
        $settings = $this->settings;
        if (!$settings) {
            $settings = $defaultSettings;
        }

        $settings['eventsManagerUserId'] = $defaultSettings['eventsManagerUserId'];

        return $settings;
    }

    public function canSignInAttendee($attendee)
    {
        $event = $attendee->attendeesGroup->nxEvent;
        if ($this->id !== $event->id) {
            throw new Exception("Attendee: ".$attendee->id." does not belong to the event", 1);
        }

        // check if attendee group max capacity was reached
        $group = $attendee->attendeesGroup;
        if ($group->signUpDeadlineDateTime->lt(\Carbon\Carbon::now())) {
            return trans('events.groupSignInExpired', ['eventName' => $this->name]);
        }

        $signedIn = $group->attendees()->whereNotNull('signedIn')->count();
        if ($signedIn >= $group->maxCapacity) {
            return trans('events.groupSignInsAreMaxed', ['eventName' => $this->name]);
        }

        $signedIn = 0;
        foreach ($this->attendeesGroups as $group) {
            $signedIn += $group->attendees()->whereNotNull('signedIn')->count();
        }

        if ($signedIn >= $this->maxCapacity) {
            return trans('events.eventSignInsAreMaxed', ['eventName' => $this->name]);
        }

        return true;
    }

    public static function getArchivedEvents()
    {
        return NxEvent::where('eventEndDateTime', '<', Carbon::now()->subMonth()->toDateString())
                        ->where('status', '=', 'published')->get();
    }

    public static function getPublishedEvents()
    {
        return NxEvent::where('status', '=', 'published')
                       ->where('eventEndDateTime', '>', Carbon::now()->subMonth()->toDateString())->get();
    }

    public static function getDraftEvents()
    {
        return NxEvent::where('status', '!=', 'published')->get();
    }

    public static function getBeforeSignInOpeningEvents()
    {
        return NxEvent::where('status', '=', 'published')
                       ->where('eventStartDateTime', '>', Carbon::now()->toDateString())
                       ->whereDoesntHave('attendeesGroups', function ($query) {
                          $query->where('signUpOpenDateTime', '<', Carbon::now()->toDateString());
                       })
                       ->get();
    }

    public static function getOpenedSignInEvents()
    {
        return NxEvent::where('status', '=', 'published')
                       ->where('eventStartDateTime', '>', Carbon::now()->toDateString())
                       ->whereHas('attendeesGroups', function ($query) {
                          $query->where('signUpOpenDateTime', '<', Carbon::now()->toDateString())
                                ->where('signUpDeadlineDateTime', '>', Carbon::now()->toDateString());
                       })
                       ->get();
    }

    public static function getClosedSignInEvents()
    {
        return NxEvent::where('status', '=', 'published')
                       ->where('eventStartDateTime', '>', Carbon::now()->toDateString())
                       ->whereDoesntHave('attendeesGroups', function ($query) {
                          $query->where('signUpOpenDateTime', '<', Carbon::now()->toDateString())
                                ->where('signUpDeadlineDateTime', '>', Carbon::now()->toDateString());
                       })
                       ->whereDoesntHave('attendeesGroups', function ($query) {
                          $query->where('signUpOpenDateTime', '>', Carbon::now()->toDateString())
                                ->where('signUpDeadlineDateTime', '>', Carbon::now()->toDateString());
                       })
                       ->get();
    }

    public static function getWaitingForFeedbackEvents()
    {
        $settings = \App\DefaultSystemSettings::getNxEventsSettings();
        $fedbackDeadlineDays = $settings['feedbackEmailDelay'] + $settings['feedbackDaysToFill'];

        $noSettings = NxEvent::where('status', '=', 'published')
                       ->where('eventEndDateTime', '<', Carbon::now()->toDateString())
                       ->doesntHave('settings')
                       ->where('eventEndDateTime', '>', Carbon::now()->subDays($fedbackDeadlineDays + 1)->toDateString())
                       ->get();

        $hasSettings = NxEvent::where('status', '=', 'published')
                       ->where('eventEndDateTime', '<', Carbon::now()->toDateString())
                       ->has('settings')
                       ->get()
                       ->filter(function ($event) {
                          $settings = $event->settings;
                          $fedbackDeadlineDays = $settings['feedbackEmailDelay'] + $settings['feedbackDaysToFill'];
                          return $event->eventEndDateTime->gt(Carbon::now()->subDays($fedbackDeadlineDays));
                       });

        return $noSettings->merge($hasSettings);
    }

    public static function getWaitingForEvaluationEvents()
    {
        $settings = \App\DefaultSystemSettings::getNxEventsSettings();
        $fedbackDeadlineDays = $settings['feedbackEmailDelay'] + $settings['feedbackDaysToFill'];

        $noSettings = NxEvent::where('status', '=', 'published')
                       ->doesntHave('settings')
                       ->where('eventEndDateTime', '>', Carbon::now()->subDays(30)->toDateString())
                       ->where('eventEndDateTime', '<', Carbon::now()->subDays($fedbackDeadlineDays)->toDateString())
                       ->get();

        $hasSettings = NxEvent::where('status', '=', 'published')
                       ->where('eventEndDateTime', '<', Carbon::now()->toDateString())
                       ->where('eventEndDateTime', '>', Carbon::now()->subDays(30)->toDateString())
                       ->has('settings')
                       ->get()
                       ->filter(function ($event) {
                          $settings = $event->settings;
                          $fedbackDeadlineDays = $settings['feedbackEmailDelay'] + $settings['feedbackDaysToFill'];
                          return $event->eventEndDateTime->lt(Carbon::now()->subDays($fedbackDeadlineDays));
                       });

        return $noSettings->merge($hasSettings);
    }

    public function attendeesGroups()
    {
        return $this->hasMany('App\AttendeesGroup', 'eventId');
    }

    public function attendees()
    {
        return $this->hasManyThrough('App\NxEventAttendee', 'App\AttendeesGroup', 'eventId', 'attendeesGroupId', 'id');
    }

    public function lectors()
    {
        return $this->belongsToMany('App\User');
    }

    public function groupedEvents()
    {
        return $this->belongsToMany('App\NxEvent', 'nx_grouped_events', 'nx_event_parent_id', 'nx_event_id');
    }

    public function exclusionaryEvents()
    {
        return $this->belongsToMany('App\NxEvent', 'nx_exclusionary_events', 'nx_event_parent_id', 'nx_event_id');
    }

    public function getParentEvent()
    {
        return $this->belongsToMany('App\NxEvent', 'nx_grouped_events', 'nx_event_id', 'nx_event_parent_id')->first();
    }

    public function host()
    {
        return $this->belongsTo('App\User', 'hostId');
    }

    public function location()
    {
        return $this->belongsTo('App\NxLocation', 'nxLocationId');
    }

    public function curriculumLevel()
    {
        return $this->hasOne('App\StudentLevel', 'curriculumLevelId');
    }

    public function semester()
    {
        return $this->belongsTo('App\Semester', 'semesterId');
    }

    public function settings()
    {
        return $this->hasOne('App\NxEventsSettings', 'eventId');
    }

    public function form()
    {
        return $this->belongsTo('App\Models\QuestionForm\Form', 'signInFormId');
    }
}
