<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\NxEvent as NxEvent;
use App\UserGroup as UserGroup;
use App\User as User;
use App\DefaultSystemSettings;

class NxEventsController extends Controller
{
    /**
     * @var \App\Transformers\NxEventTransformer
     */
    protected $nxEventTransformer;

    function __construct(
      \App\Transformers\NxEventTransformer $nxEventTransformer,
      \App\Transformers\NxEventsSettingsTransformer $defaultSettingsTransformer
    )
    {
        $this->nxEventTransformer = $nxEventTransformer;
        $this->defaultSettingsTransformer = $defaultSettingsTransformer;
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

        return response()->json($this->defaultSettingsTransformer->transform($settings));
    }

    public function updateDefaultEventsSettings(Request $request)
    {
        $validator = \Validator::make($request->all(), [
          'feedbackEmailDelay' => 'required|numeric|min:1|max:31',
          'feedbackDaysToFill' => 'required|numeric|min:1|max:31',
          'feedbackRemainderDaysBefore' => 'required|numeric|min:1|max:31',
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

        return response()->json($this->defaultSettingsTransformer->transform($settings));
    }
}
