<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Carbon\Carbon;

use App\User;
use App\AttendeesGroup;
use App\StudentLevel;
use App\Models\QuestionForm\Form as QuestionForm;
use App\Models\QuestionForm\FormDescription;
use App\Models\QuestionForm\Question;
use App\Models\QuestionForm\Choice;

class NxEventTerm extends Model implements AuditableContract
{
    use SoftDeletes;
    use Auditable;

    protected $fillable = [
        'hostId',
        'eventId',
        'userId',
        'nxLocationId',
        'eventStartDateTime',
        'eventEndDateTime',
        'minCapacity',
        'maxCapacity',
        'publicFeedbackLink',
        'feedbackLink',
        'parentTermId',
    ];

    protected $dateFormat = 'Y-m-d H:i:s';
    protected $dates = ['deleted_at', 'eventEndDateTime', 'eventStartDateTime'];

    public function event()
    {
        return $this->belongsTo('App\NxEvent', 'eventId');
    }

    public function location()
    {
        return $this->belongsTo('App\NxLocation', 'nxLocationId')->withTrashed();
    }

    public function parentTerm()
    {
        return $this->belongsTo('App\NxEventTerm', 'parentTermId');
    }

    public function terms()
    {
        return $this->hasMany('App\NxEventTerm', 'parentTermId');
    }

    public function attendees()
    {
        return $this->belongsToMany('App\NxEventAttendee', 'nx_event_attendees_nx_event_terms', 'termId', 'attendeeId')
                    ->withPivot(['signedIn', 'signedOut', 'wontGo', 'signedOutReason', 'standIn', 'wasPresent', 'filledFeedback']);
    }

    public function host()
    {
        return $this->belongsTo('App\User', 'hostId');
    }

    public function owner()
    {
        return $this->belongsTo('App\User', 'userId');
    }
}
