<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use BrianFaust\Commentable\HasComments;

use App\DefaultSystemSettings;
use App\User;

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

    public function guidesOptions()
    {
        return $this->belongsToMany('App\Models\Guide', 'student_guide_options', 'studentId', 'guideId')
            ->withPivot([
                'id',
                'priority',
                'semesterId',
                'howCanIHelp',
                'whyIWouldChooseThisGuide',
                'deleted_at',
                'created_at',
                'updated_at',
            ])->wherePivot('deleted_at', '=', null);
    }
}
