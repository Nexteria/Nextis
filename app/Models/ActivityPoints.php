<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class ActivityPoints extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'gainedPoints',
        'maxPossiblePoints',
        'semesterId',
        'activityName',
        'note',
        'addedByUserId',
        'studentId',
        'activityType',
        'activityModelId',
    ];

    protected $casts = [
        'gainedPoints' => 'integer',
        'maxPossiblePoints' => 'integer',
        'semesterId' => 'integer',
        'addedByUserId' => 'integer',
        'studentId' => 'integer',
        'activityModelId' => 'integer',
    ];

    public function student()
    {
        return $this->belongsTo('App\Student', 'studentId');
    }
}
