<?php namespace App\Transformers;

class UserPaymentSettingsTransformer extends Transformer
{

    public function transform($settings)
    {
        return [
          'schoolFeePaymentsDeadlineDay' => $settings->schoolFeePaymentsDeadlineDay,
          'checkingSchoolFeePaymentsDay' => $settings->checkingSchoolFeePaymentsDay,
          'generationSchoolFeeDay' => $settings->generationSchoolFeeDay,
          'disableEmailNotifications' => $settings->disableEmailNotifications,
          'disableSchoolFeePayments' => $settings->disableSchoolFeePayments,
        ];
    }
}
