<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class TuitionDefaultSettings extends Model
{
    protected $fillable = [
        'schoolFeeApplicableMonths',
        'schoolFeePaymentsDeadlineDay',
        'checkingSchoolFeePaymentsDay',
        'generationSchoolFeeDay',
    ];

    protected $casts = [
        'schoolFeeApplicableMonths' => 'array',
        'schoolFeePaymentsDeadlineDay' => 'integer',
        'checkingSchoolFeePaymentsDay' => 'integer',
        'generationSchoolFeeDay' => 'integer',
    ];

    public function getSchoolFeeApplicableMonthsAttribute($schoolFeeApplicableMonths)
    {
        return array_map('intval', explode(',', $schoolFeeApplicableMonths));
    }

    public function setSchoolFeeApplicableMonthsAttribute($schoolFeeApplicableMonths)
    {
        $this->attributes['schoolFeeApplicableMonths'] = implode(',', $schoolFeeApplicableMonths);
    }
}
