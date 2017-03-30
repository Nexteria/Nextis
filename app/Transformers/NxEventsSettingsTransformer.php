<?php namespace App\Transformers;

class NxEventsSettingsTransformer extends Transformer
{

    public function transform($settings)
    {
        return [
            'feedbackEmailDelay' => (int) $settings['feedbackEmailDelay'],
            'feedbackDaysToFill' => (int) $settings['feedbackDaysToFill'],
            'feedbackRemainderDaysBefore' => (int) $settings['feedbackRemainderDaysBefore'],
            'hostInstructionEmailDaysBefore' => (int) $settings['hostInstructionEmailDaysBefore'],
            'eventsManagerUserId' => (int) $settings['eventsManagerUserId'],
            'eventSignInOpeningManagerNotificationDaysBefore' => (int) $settings['eventSignInOpeningManagerNotificationDaysBefore'],
            'eventSignInRemainderDaysBefore' => (int) $settings['eventSignInRemainderDaysBefore'],
            'sentCopyOfAllEventNotificationsToManager' => $settings['sentCopyOfAllEventNotificationsToManager'],
         ];
    }
}
