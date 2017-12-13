<?php

namespace App;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Semester extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'startDate',
        'endDate',
    ];

    protected $dates = ['deleted_at', 'startDate', 'endDate'];

    public function events()
    {
        return $this->hasMany('App\NxEvent', 'semesterId');
    }

    public function students()
    {
        return $this->belongsToMany('App\Student', 'semester_student', 'semesterId', 'studentId')
                    ->withPivot([
                      'studentLevelId',
                      'tuitionFee',
                      'activityPointsBaseNumber',
                      'minimumSemesterActivityPoints'
                    ]);
    }

    public function studentLevels()
    {
        return $this->belongsToMany('App\StudentLevel', 'semester_student_level', 'semesterId', 'studentLevelId')
                    ->withPivot([
                      'tuitionFee',
                      'activityPointsBaseNumber',
                      'minimumSemesterActivityPoints'
                    ]);
    }

    public function getSignedOutStudentsCount()
    {
        $eventIds = $this->events()->where('status', 'published')->pluck('id');
        $termIds = NxEventTerm::whereIn('eventId', $eventIds)
            ->whereRaw('eventEndDateTime < NOW()')
            ->pluck('id');
        $signedOutAttendeesCount = \DB::table('nx_event_attendees_nx_event_terms')
            ->whereIn('termId', $termIds)
            ->whereNotNull('signedOut')
            ->count();
        
        return $signedOutAttendeesCount;
    }

    public function getDidNotComeStudentsCount()
    {
        $eventIds = $this->events()->where('status', 'published')->pluck('id');
        $termIds = NxEventTerm::whereIn('eventId', $eventIds)
            ->whereRaw('eventEndDateTime < NOW()')
            ->pluck('id');
        $didNotComeAttendeesCount = \DB::table('nx_event_attendees_nx_event_terms')
            ->whereIn('termId', $termIds)
            ->whereNotNull('signedIn')
            ->where(function ($query) {
                $query->whereNull('wasPresent');
                $query->orWhere('wasPresent', false);
            })
            ->count();
        
        return $didNotComeAttendeesCount;
    }
}
