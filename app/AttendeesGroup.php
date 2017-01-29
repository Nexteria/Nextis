<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\User;

class AttendeesGroup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'signUpOpenDateTime',
        'signUpDeadlineDateTime',
        'minCapacity',
        'maxCapacity',
    ];

    protected $dateFormat = 'Y-m-d H:i:s';
    protected $dates = ['deleted_at', 'signUpOpenDateTime', 'signUpDeadlineDateTime'];

    public static function createNew($attributes = [])
    {
        $group = new AttendeesGroup($attributes);
        $group->ownerId = \Auth::user()->id;
        $group->save();

        foreach ($attributes['users'] as $user) {
          $group->attendees()->save(NxEventAttendee::createNew(array_merge($user, ["attendeesGroupId" => $group->id])));
        }

        $group->save();
        return $group;
    }

    public function updateData($attributes)
    {
        $this->fill($attributes);
        $this->ownerId = \Auth::user()->id;

        $idsMap = [];
        foreach ($attributes['users'] as $user) {
            $attendee = $this->attendees()->where('userId', '=', $user['id'])->first();
            if ($attendee) {
                $attendee->updateData(array_merge($user, ["attendeesGroupId" => $this->id]));
            } else {
                $attendee = NxEventAttendee::createNew(array_merge($user, ["attendeesGroupId" => $this->id]));
                $this->attendees()->save($attendee);
            }
            $idsMap[$attendee->id] = true;
        }

        $ids = $this->attendees()->pluck('id');
        foreach ($ids as $id) {
            if (!isset($idsMap[$id])) {
                NxEventAttendee::find($id)->delete();
            }
        }

        $this->save();
    }

    public function attendees()
    {
        return $this->HasMany('App\NxEventAttendee', 'attendeesGroupId');
    }

    public function owner()
    {
        return $this->hasOne('App\User', 'ownerId');
    }

    public function nxEvent()
    {
        return $this->belongsTo('App\NxEvent', 'eventId');
    }
}
