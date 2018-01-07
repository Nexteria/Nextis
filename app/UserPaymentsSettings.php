<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class UserPaymentsSettings extends Model
{
    protected $fillable = [
        'schoolFeePaymentsDeadlineDay',
        'checkingSchoolFeePaymentsDay',
        'generationSchoolFeeDay',
        'disableEmailNotifications',
        'disableSchoolFeePayments',
        'userId',
    ];

    public function user()
    {
        return $this->belongsTo('App\User', 'userId');
    }
}
