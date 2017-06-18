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
}
