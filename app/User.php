<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

use App\Role;
use App\Payment;
use App\StudentLevel;
use Carbon\Carbon;
use App\NxEventTerm;

class User extends Authenticatable implements AuditableContract
{
    use Auditable;
    use SoftDeletes, Notifiable, EntrustUserTrait {
        SoftDeletes::restore insteadof EntrustUserTrait;
        EntrustUserTrait::restore insteadof SoftDeletes;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'firstName',
        'lastName',
        'phone',
        'email',
        'facebookLink',
        'linkedinLink',
        'actualJobInfo',
        'school',
        'faculty',
        'studyProgram',
        'studyYear',
        'state',
        'iban',
        'nexteriaTeamRole',
        'dateOfBirth',
        'skills',
    ];

    protected $dates = ['dateOfBirth', 'deleted_at'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public static function createNew($attributes = [])
    {
        $user = User::create($attributes);
        $user->save();

        $user->personalDescription = clean($attributes['personalDescription']);
        $user->buddyDescription = clean($attributes['buddyDescription']);
        $user->guideDescription = clean($attributes['guideDescription']);
        $user->lectorDescription = clean($attributes['lectorDescription']);
        $user->hobby = clean($attributes['hobby']);
        $user->otherActivities = clean($attributes['otherActivities']);

        if ($attributes['newPassword'] === $attributes['confirmationPassword']) {
            $user->password = \Hash::make($attributes['newPassword']);
        }
        
        if ($attributes['profilePicture']) {
            $user->profilePictureId = $attributes['profilePicture']->id;
        }

        $user->roles()->sync(Role::whereIn('id', $attributes['roles'])->pluck('id')->toArray());

        $user->save();
        return $user;
    }

    public function updateData($attributes = [])
    {
        $this->fill($attributes);

        if (isset($attributes['roles'])) {
            $this->roles()->sync(Role::whereIn('id', $attributes['roles'])->pluck('id')->toArray());
        }

        if (isset($attributes['personalDescription'])) {
            $this->personalDescription = clean($attributes['personalDescription']);
        }

        if (isset($attributes['buddyDescription'])) {
            $this->buddyDescription = clean($attributes['buddyDescription']);
        }

        if (isset($attributes['guideDescription'])) {
            $this->guideDescription = clean($attributes['guideDescription']);
        }

        if (isset($attributes['lectorDescription'])) {
            $this->lectorDescription = clean($attributes['lectorDescription']);
        }

        if (isset($attributes['hobby'])) {
            $this->hobby = clean($attributes['hobby']);
        }

        if (isset($attributes['otherActivities'])) {
            $this->otherActivities = clean($attributes['otherActivities']);
        }

        if (isset($attributes['confirmedPrivacyPolicy'])) {
            $this->confirmedPrivacyPolicy = $attributes['confirmedPrivacyPolicy'];
        }

        if (isset($attributes['confirmedMarketingUse'])) {
            $this->confirmedMarketingUse = $attributes['confirmedMarketingUse'];
        }

        if (isset($attributes['photo'])) {
          // TODO upload photos
        }

        $this->save();
    }

    public function roles()
    {
        return $this->belongsToMany('App\Role');
    }

    public function profilePicture()
    {
        return $this->belongsTo('App\Image', 'profilePictureId');
    }

    public function student()
    {
        return $this->hasOne('App\Student', 'userId');
    }

    public function payments()
    {
        return $this->hasMany('App\Payment', 'userId')->orderBy('created_at');
    }

    public function skills()
    {
        return $this->belongsToMany('App\Skill');
    }

    public function paymentCategories()
    {
        return $this->hasMany('App\PaymentCategory', 'userId');
    }

    public function hostedEventsQuery()
    {
        $userId = $this->id;
        return \App\NxEvent::join('nx_event_terms', 'nx_events.id', '=', 'nx_event_terms.eventId')
            ->where('hostId', $userId)
            ->where('eventEndDateTime', '>', Carbon::now()->subMonth())
            ->whereNull('nx_event_terms.deleted_at');
    }

    public function eventAttendees()
    {
        return $this->hasMany('App\NxEventAttendee', 'userId');
    }

    public function computeActivityPoints($semesterId = null)
    {
        if (!$semesterId) {
            $semesterId = \App\DefaultSystemSettings::get('activeSemesterId');
        }

        $eventAttendees = $this->eventAttendees()
            ->join('attendees_groups', 'attendees_groups.id', '=', 'attendeesGroupId')
            ->join('nx_events', 'nx_events.id', '=', 'eventId')
            ->where('semesterId', $semesterId)
            ->where('status', 'published')
            ->get();

        $sumGainedPoints = 0;
        $sumPotentialPoints = 0;
        $sumPossibleMissedPoints = 0;

        if ($this->student) {
            $sumGainedPoints = $this->student->activityPoints()->where('semesterId', $semesterId)->sum('gainedPoints');
        }

        foreach ($eventAttendees as $attendee) {
            $event = $attendee->event();
            if ($event != null && !$event->getParentEvent()) {
                if ($event->eventStartDateTime < Carbon::now() && $event->eventEndDateTime < Carbon::now()) {
                    $sumPotentialPoints += $event->activityPoints;
                }
                if ($attendee->wasPresent && !$attendee->filledFeedback) {
                    $sumPossibleMissedPoints += $event->activityPoints;
                }
            }
        }

        return [
            'sumGainedPoints' => $sumGainedPoints,
            'sumPotentialPoints' => $sumPotentialPoints,
            'sumPossibleMissedPoints' => $sumPossibleMissedPoints,
        ];
    }

    public function getEventsWithInvitation($filters = []) {
        $attendeesQuery = NxEventAttendee::where('userId', $this->id)
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

    public function getMeetings()
    {
        $termIds = NxEventTerm::whereRaw('eventStartDateTime > NOW()')
            ->join('nx_event_attendees_nx_event_terms', 'nx_event_terms.id', '=', 'termId')
            ->join('nx_event_attendees', 'nx_event_attendees.id', '=', 'attendeeId')
            ->where('nx_event_attendees.userId', $this->id)
            ->whereNotNull('nx_event_attendees.signedIn')
            ->where('nx_event_attendees.signedIn', '!=', '')
            ->whereNull('nx_event_attendees.deleted_at')
            ->pluck('termId');

        return NxEventTerm::whereIn('id', $termIds)->get();
    }

    public function getTermsWaitingForFeedback()
    {
        $attendeeIds = $this->eventAttendees()
            ->whereNotNull('signedIn')
            ->whereNull('filledFeedback')
            ->pluck('id');
        
        $terms = NxEventTerm::whereNotNull('nx_event_terms.feedbackOpenAt')
            ->whereNotNull('publicFeedbackLink')
            ->whereHas('attendees', function ($query) use ($attendeeIds) {
                $query->whereIn('attendeeId', $attendeeIds)
                    ->whereNull('nx_event_attendees_nx_event_terms.filledFeedback')
                    ->whereNotNull('nx_event_attendees_nx_event_terms.wasPresent');
            })->get();

        return $terms;
    }

    public function generateMonthlySchoolFee($month, $year, $adminUserId, $createdAt = null)
    {
        $tuitionSettings = \App\TuitionDefaultSettings::first();

        $paymentSettings = $this->paymentSettings;
        if (!$paymentSettings) {
            $paymentSettings = $tuitionSettings;
        }

        $newPayment = new Payment();
        $newPayment->message = "Skolne za ".$month.'.'.$year;
        $newPayment->transactionType = 'debet';
        $newPayment->userId = $this->id;
        $newPayment->deadline_at = Carbon::createFromDate($year, $month, $paymentSettings->schoolFeePaymentsDeadlineDay);
        $newPayment->addedByUserId = $adminUserId;
        $newPayment->amount = $this->student->getActiveSemester()->pivot->tuitionFee;
        $newPayment->variableSymbol = $this->student->tuitionFeeVariableSymbol;
        $newPayment->description = 'Automaticky vygenerovane';

        if ($createdAt) {
            $newPayment->save();
            $newPayment->created_at = $createdAt;
        }

        $this->payments()->save($newPayment);
    }

    public function getAccountBalance()
    {
        $accountBalance = 0;
        foreach ($this->payments as $payment) {
            if ($payment->transactionType == 'kredit') {
                $accountBalance += $payment->amount;
            } else {
                $accountBalance -= $payment->amount;
            }
        }

        return $accountBalance;
    }

    public function paymentSettings()
    {
        return $this->hasOne('App\UserPaymentsSettings', 'userId');
    }

    public function sendPasswordResetNotification($token)
    {
        $email = new \App\Mail\Auth\PasswordResetMail($this, $token);
        \Mail::send($email);
    }
}
