<?php namespace App\Transformers;

class TuitionDefaultSettingsTransformer extends Transformer
{

    public function transform($settings)
    {
        return [
          'schoolFeeApplicableMonths' => $settings->schoolFeeApplicableMonths,
          'schoolFeePaymentsDeadlineDay' => $settings->schoolFeePaymentsDeadlineDay,
          'checkingSchoolFeePaymentsDay' => $settings->checkingSchoolFeePaymentsDay,
          'generationSchoolFeeDay' => $settings->generationSchoolFeeDay,
        ];
    }
}
