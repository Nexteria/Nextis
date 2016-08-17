<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\User;
use App\AttendeesGroup;

class NxEventAttendee extends Authenticatable
{
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
    ];

    protected $dates = ['deleted_at', 'signedIn', 'signedOut', 'wontGo'];

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
}
