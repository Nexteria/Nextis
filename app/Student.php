<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\DefaultSystemSettings;
use App\User;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'firstName',
        'lastName',
        'tuitionFeeVariableSymbol',
        'status',
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
                      'activityPointsBaseNumber',
                      'minimumSemesterActivityPoints'
                    ]);
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
}
