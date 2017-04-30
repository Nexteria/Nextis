<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\User;
use App\AttendeesGroup;
use App\StudentLevel;

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
        $event->save();

        foreach ($attributes['attendeesGroups'] as $group) {
            $event->attendeesGroups()->save(AttendeesGroup::createNew($group));
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

        $event->save();

        if (isset($attributes['semester']) && $attributes['semester']) {
            $semester = \App\Semester::findOrFail($attributes['semester']);
            $semester->events()->save($event);
        }

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

        $semesters = [];
        if (isset($attributes['semester']) && $attributes['semester']) {
            $semester = \App\Semester::findOrFail($attributes['semester']);
            $semesters[] = $semester->id;
        }
        $this->semesters()->sync($semesters);

        $this->save();
    }

    public function getSettings()
    {
        $settings = $this->settings;
        if (!$settings) {
            $settings = \App\DefaultSystemSettings::getNxEventsSettings();
        }

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
        $signedIn = $group->attendees()->whereNotNull('signedIn')->count();
        if ($signedIn >= $group->maxCapacity) {
            return false;
        }

        $signedIn = 0;
        foreach ($this->attendeesGroups as $group) {
            $signedIn += $group->attendees()->whereNotNull('signedIn')->count();
        }

        if ($signedIn >= $this->maxCapacity) {
            return false;
        }

        return true;
    }

    public function attendeesGroups()
    {
        return $this->hasMany('App\AttendeesGroup', 'eventId');
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

    public function semesters()
    {
        return $this->belongsToMany('App\Semester');
    }

    public function settings()
    {
        return $this->hasOne('App\NxEventsSettings', 'eventId');
    }
}
