<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use BrianFaust\Commentable\HasComments;

use App\DefaultSystemSettings;
use App\User;
use App\AttendeesGroup;
use App\NxEventAttendee;
use App\NxEvent;

class Student extends Model
{
    use SoftDeletes;
    use HasComments;

    protected $fillable = [
        'firstName',
        'lastName',
        'tuitionFeeVariableSymbol',
        'status',
        'studentLevelId',
        'userId',
    ];

    public function user()
    {
        return $this->belongsTo('App\User', 'userId');
    }

    public function level()
    {
        return $this->belongsTo('App\StudentLevel', 'studentLevelId');
    }

    public function getActiveSemester()
    {
        return $this->semesters()
                    ->where('semesterId', DefaultSystemSettings::get('activeSemesterId'))
                    ->first();
    }

    public function semesters()
    {
        return $this->belongsToMany('App\Semester', 'semester_student', 'studentId', 'semesterId')
                    ->withPivot([
                      'studentLevelId',
                      'tuitionFee',
                      'guideId',
                      'activityPointsBaseNumber',
                      'minimumSemesterActivityPoints'
                    ]);
    }

    public function activityPoints()
    {
        return $this->hasMany('\App\Models\ActivityPoints', 'studentId');
    }

    public function getTuitionFeeBalance()
    {
        $accountBalance = 0;
        foreach ($this->user->payments()->where('variableSymbol', $this->tuitionFeeVariableSymbol)->get() as $payment) {
            if ($payment->transactionType == 'kredit') {
                $accountBalance += $payment->amount;
            } else {
                $accountBalance -= $payment->amount;
            }
        }

        return $accountBalance;
    }

    public function getMeetings()
    {
        $termIds = NxEventTerm::whereRaw('eventStartDateTime > NOW()')
            ->join('nx_event_attendees_nx_event_terms', 'nx_event_terms.id', '=', 'termId')
            ->join('nx_event_attendees', 'nx_event_attendees.id', '=', 'attendeeId')
            ->where('nx_event_attendees.userId', $this->userId)
            ->whereNotNull('nx_event_attendees.signedIn')
            ->whereNull('nx_event_attendees.deleted_at')
            ->pluck('termId');

        return NxEventTerm::whereIn('id', $termIds)->get();
    }

    public function guidesOptions()
    {
        return $this->belongsToMany('App\Models\Guide', 'student_guide_options', 'studentId', 'guideId')
            ->withPivot([
                'id',
                'priority',
                'semesterId',
                'whyIWouldChooseThisGuide',
                'whyDoYouRefuseThisGuide',
                'deleted_at',
                'created_at',
                'updated_at',
            ])->wherePivot('deleted_at', '=', null);
    }

    public function getOpenEventsForSignin($filters = [])
    {
        $attendeesQuery = NxEventAttendee::where('userId', $this->userId)
            ->whereRaw('signInOpenDateTime <= NOW()')
            ->whereRaw('signInCloseDateTime > NOW()');
        
        foreach ($filters as $key => $value) {
            switch ($key) {
                case 'signedIn':
                    if ($value) {
                        $attendeesQuery->whereNotNull('signedIn');
                    } else {
                        $attendeesQuery->whereNull('signedIn');
                    }
                    break;

                case 'semesterId':
                    break;

                default:
                    throw new \Exception('Unknown filter: '.$key);
                    break;
            }
        }
            
        
        $attendeeGroupIds = $attendeesQuery->pluck('attendeesGroupId');

        $eventIds = AttendeesGroup::whereIn('id', $attendeeGroupIds)->pluck('eventId');

        $eventsQuery = NxEvent::whereIn('id', $eventIds)->where('status', 'published');
        if (isset($filters['semesterId'])) {
            $eventsQuery->where('semesterId', $filters['semesterId']);
        }

        $events = $eventsQuery->get();

        return $events;
    }

    public function getTermsWaitingForFeedback()
    {
        $attendeeIds = NxEventAttendee::where('userId', $this->userId)
            ->whereNotNull('signedIn')
            ->whereNull('filledFeedback')
            ->pluck('id');
        
        $terms = NxEventTerm::whereRaw('nx_event_terms.feedbackDeadlineAt > NOW()')
            ->whereNotNull('nx_event_terms.feedbackOpenAt')
            ->whereNotNull('publicFeedbackLink')
            ->whereHas('attendees', function ($query) use ($attendeeIds) {
                $query->whereIn('attendeeId', $attendeeIds)
                    ->whereNull('nx_event_attendees_nx_event_terms.filledFeedback')
                    ->whereNotNull('nx_event_attendees_nx_event_terms.wasPresent');
            })->get();

        return $terms;
    }

    public function unfinishedEvents($filters = [])
    {
        $attendeesQuery = NxEventAttendee::where('userId', $this->userId)
            ->whereNotNull('signedIn')
            ->where(function ($query) {
                $query->whereNull('wasPresent');
                $query->orWhereNull('filledFeedback');
            })
            ->whereHas('terms', function ($query) {
                $query->whereNotNull('nx_event_attendees_nx_event_terms.signedIn');
                $query->where(function ($subQuery) {
                    $subQuery->whereNotNull('nx_event_attendees_nx_event_terms.feedbackOpenAt');
                    $subQuery->whereRaw('nx_event_attendees_nx_event_terms.feedbackDeadlineAt > NOW()');
                });
            });

        $attendeeGroupIds = $attendeesQuery->pluck('attendeesGroupId');

        $eventIds = AttendeesGroup::whereIn('id', $attendeeGroupIds)->pluck('eventId');

        $eventsQuery = NxEvent::whereIn('id', $eventIds)->where('status', 'published');
        if (isset($filters['semesterId'])) {
            $eventsQuery->where('semesterId', $filters['semesterId']);
        }

        $events = $eventsQuery->get();

        return $events;
    }
}
