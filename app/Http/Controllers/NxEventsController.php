<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\NxEvent as NxEvent;
use App\UserGroup as UserGroup;
use App\User as User;
use App\DefaultSystemSettings;
use App\NxEventsSettings;

class NxEventsController extends Controller
{
    /**
     * @var \App\Transformers\NxEventTransformer
     */
    protected $nxEventTransformer;

    /**
     * @var \App\Transformers\NxEventsSettingsTransformer
     */
    protected $nxEventsSettingsTransformer;

    function __construct(
      \App\Transformers\NxEventTransformer $nxEventTransformer,
      \App\Transformers\NxEventsSettingsTransformer $nxEventsSettingsTransformer
    )
    {
        $this->nxEventTransformer = $nxEventTransformer;
        $this->nxEventsSettingsTransformer = $nxEventsSettingsTransformer;
    }

    public function createNxEvent()
    {
        $event = NxEvent::createNew(\Input::all());

        return response()->json($this->nxEventTransformer->transform($event));
    }

    public function updateNxEvent()
    {
        $event = NxEvent::findOrFail(\Input::get('id'));
        $event->updateData(\Input::all());

        return response()->json($this->nxEventTransformer->transform($event->fresh()));
    }

    public function getNxEvents()
    {
        $events = NxEvent::all();

        return response()->json($this->nxEventTransformer->transformCollection($events));
    }

    public function deleteNxEvent($eventId)
    {
        NxEvent::findOrFail($eventId)->delete();
    }

    public function getDefaultEventsSettings()
    {
        $settings = DefaultSystemSettings::getNxEventsSettings();

        return response()->json($this->nxEventsSettingsTransformer->transform($settings));
    }

    public function updateDefaultEventsSettings(Request $request)
    {
        $validator = \Validator::make($request->all(), [
          'feedbackEmailDelay' => 'required|numeric|min:1|max:31',
          'feedbackDaysToFill' => 'required|numeric|min:1|max:31',
          'feedbackRemainderDaysBefore' => 'required|numeric|min:1|max:31',
          'hostInstructionEmailDaysBefore' => 'required|numeric|min:1|max:31',
          'eventsManagerUserId' => 'required|numeric|min:1',
          'eventSignInOpeningManagerNotificationDaysBefore' => 'required|numeric|min:1|max:31',
          'eventSignInRemainderDaysBefore' => 'required|numeric|min:1|max:31',
          'sentCopyOfAllEventNotificationsToManager' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        foreach ($request->all() as $key => $value) {
            DefaultSystemSettings::set($key, $value);
        }

        $settings = DefaultSystemSettings::getNxEventsSettings();

        return response()->json($this->nxEventsSettingsTransformer->transform($settings));
    }

    public function validateFeedbackForm()
    {
        $response = \FeedbackForms::validate(\Input::get('feedbackFormUrl'));

        if ($response['code'] == 200) {
            return response()->json([
              'code' => 200,
              'publicResponseUrl' => $response['publicResponseUrl']
            ]);
        }

        return response()->json([
          'code' => 500,
          'error' => $response['error'],
        ]);
    }

    public function getNxEventSettings($eventId)
    {
        $event = NxEvent::find($eventId);

        if (!$event || !$event->settings) {
            abort(404);
        }

        return response()->json($this->nxEventsSettingsTransformer->transform($event->settings));
    }

    public function updateNxEventSettings(Request $request, $eventId)
    {
        $validator = \Validator::make($request->all(), [
          'feedbackEmailDelay' => 'required|numeric|min:1|max:31',
          'feedbackDaysToFill' => 'required|numeric|min:1|max:31',
          'feedbackRemainderDaysBefore' => 'required|numeric|min:1|max:31',
          'hostInstructionEmailDaysBefore' => 'required|numeric|min:1|max:31',
          'eventSignInOpeningManagerNotificationDaysBefore' => 'required|numeric|min:1|max:31',
          'eventSignInRemainderDaysBefore' => 'required|numeric|min:1|max:31',
        ]);

        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $event = NxEvent::findOrFail($eventId);

        if (!$event->settings) {
            $event->settings()->save(new NxEventsSettings($request->all()));
        } else {
            $event->settings->update($request->all());
        }

        $defaultSettings = DefaultSystemSettings::getNxEventsSettings();
        $event->settings->update(['eventsManagerUserId' => $defaultSettings['eventsManagerUserId']]);

        return response()->json([], 200);
    }
}
