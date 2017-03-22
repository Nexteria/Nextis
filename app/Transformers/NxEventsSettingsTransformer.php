<?php namespace App\Transformers;

class NxEventsSettingsTransformer extends Transformer
{

    public function transform($settings)
    {
        return [
            'feedbackEmailDelay' => (int) $settings['feedbackEmailDelay'],
            'feedbackDaysToFill' => (int) $settings['feedbackDaysToFill'],
            'feedbackRemainderDaysBefore' => (int) $settings['feedbackRemainderDaysBefore'],
         ];
    }
}
