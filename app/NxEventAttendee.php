<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

use App\User;
use App\AttendeesGroup;

class NxEventAttendee extends Authenticatable implements AuditableContract
{
    use Auditable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'signedIn',
        'signedOut',
        'wontGo',
        'wasPresent',
        'filledFeedback',
    ];

    protected $dates = ['deleted_at', 'signedIn', 'signedOut', 'wontGo', 'standIn'];

    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);

        if ($this->signInToken === null) {
            $this->signInToken = str_random(32);
        }
    }

    public static function createNew($attributes = [])
    {
        $attendee = new NxEventAttendee($attributes);
        $attendee->ownerId = \Auth::user()->id;
        $attendee->userId = User::findOrFail($attributes['id'])->id;
        $attendee->attendeesGroupId = AttendeesGroup::findOrFail($attributes['attendeesGroupId'])->id;
        $attendee->signedOutReason = clean($attributes['signedOutReason']);

        $attendee->save();
        return $attendee;
    }

    public function updateData($attributes)
    {
        $this->fill($attributes);
        $this->ownerId = \Auth::user()->id;

        $this->attendeesGroupId = AttendeesGroup::findOrFail($attributes['attendeesGroupId'])->id;

        if (isset($attributes['signedOutReason'])) {
            $this->signedOutReason = clean($attributes['signedOutReason']);
        }

        $this->save();
    }

    public function user()
    {
        return $this->belongsTo('App\User', 'userId');
    }

    public function attendeesGroup()
    {
        return $this->belongsTo('App\AttendeesGroup', 'attendeesGroupId');
    }

    public function terms()
    {
        return $this->belongsToMany('App\NxEventTerm', 'nx_event_attendees_nx_event_terms', 'attendeeId', 'termId');
    }

    public function event()
    {
        $result = [];
        $eventGroup = $this->attendeesGroup()->first();
        if ($eventGroup !== null) {
            $eventId = $this->attendeesGroup()->first()->eventId;
            $event = NxEvent::find($eventId);
            if ($event !== null) {
                return $event;
            }
        }

        return null;
    }
}
