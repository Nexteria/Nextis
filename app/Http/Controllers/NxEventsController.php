<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\NxEvent as NxEvent;
use App\NxEventTerm;
use App\UserGroup as UserGroup;
use App\User as User;
use Carbon\Carbon;
use App\DefaultSystemSettings;
use App\NxEventsSettings;
use Illuminate\Support\Str;
use Mailgun;

class NxEventsController extends Controller
{
    /**
     * @var \App\Transformers\NxEventTransformer
     */
    protected $nxEventTransformer;

    /**
     * @var \App\Transformers\Student\NxEventTransformer
     */
    protected $nxEventStudentTransformer;

    /**
     * @var \App\Transformers\NxEventsSettingsTransformer
     */
    protected $nxEventsSettingsTransformer;

    /**
     * @var \App\Transformers\UserTransformer
     */
    protected $userTransformer;

    public function __construct(
        \App\Transformers\NxEventTransformer $nxEventTransformer,
        \App\Transformers\Student\NxEventTransformer $nxEventStudentTransformer,
        \App\Transformers\NxEventsSettingsTransformer $nxEventsSettingsTransformer,
        \App\Transformers\BeforeEventQuestionnaireTransformer $beforeEventQuestionnaireTransformer,
        \App\Transformers\UserTransformer $userTransformer
    ) {
        $this->nxEventTransformer = $nxEventTransformer;
        $this->userTransformer = $userTransformer;
        $this->nxEventStudentTransformer = $nxEventStudentTransformer;
        $this->nxEventsSettingsTransformer = $nxEventsSettingsTransformer;
        $this->beforeEventQuestionnaireTransformer = $beforeEventQuestionnaireTransformer;
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

    public function getNxEvents(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'semesterId' => 'numeric',
            'status' => 'string',
            'dateFrom' => 'date',
            'dateTo' => 'date|after:dateFrom',
          ]);
  
        if ($validator->fails()) {
            $messages = '';
            foreach (json_decode($validator->messages()) as $message) {
                $messages .= ' '.implode(' ', $message);
            }
            
            return response()->json(['error' => $messages], 400);
        }

        $filters = collect([
            'semesterId' => DefaultSystemSettings::get('activeSemesterId'),
            'status' => 'published',
        ]);

        $query = NxEvent::query();
        $filters->mapWithKeys(function ($item, $key) use ($request) {
            if ($request->has($key)) {
                return [$key => $request->get($key)];
            }

            return [$key => $item];
        })->reject(function ($value, $key) {
            if ($value === 'all') {
                return true;
            }

            return false;
        })->each(function ($item, $key) use ($query) {
            $query = $query->where($key, $item);
        });

        if ($request->has('dateFrom')) {
            $query = $query->whereHas('terms', function ($termsQuery) use ($request) {
                $termsQuery->where('eventStartDateTime', '>=', $request->get('dateFrom'));
            });
        }

        if ($request->has('dateTo')) {
            $query = $query->whereHas('terms', function ($termsQuery) use ($request) {
                $termsQuery->where('eventStartDateTime', '<=', $request->get('dateTo'));
            });
        }
        
        $events = $query
                        ->with('lectors')
                        ->with('semester')
                        ->with('form.questions.choices')
                        ->with('form.questions.attendeesGroups')
                        ->get();

        return response()->json($this->nxEventStudentTransformer->transformCollection($events));
    }

    public function getEventAttendees(Request $request, $eventId)
    {
        $event = NxEvent::findOrFail($eventId);
        $attendeesType = $request->get('type');

        switch ($attendeesType) {
            case 'signedIn':
                $attendeesIds = $event->attendees()->whereNotNull('signedIn')->pluck('userId');
                break;
            
            case 'signedOut':
                $attendeesIds = $event->attendees()->whereNotNull('signedOut')->pluck('userId');
                break;

            case 'wontGo':
                $attendeesIds = $event->attendees()->whereNotNull('wontGo')->pluck('userId');
                break;
            
            case 'standIn':
                $attendeesIds = $event->attendees()->whereNotNull('standIn')->pluck('userId');
                break;
            
            default:
                $attendeesIds = $event->attendees()->pluck('userId');
                break;
        }

        $users = \App\User::whereIn('id', $attendeesIds)->get();

        return $this->userTransformer->transformCollection($users, []);
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

    public function getEmailsStats($eventId)
    {
        $emailTagBase = NxEvent::findOrFail($eventId)->emailTagBase;

        $emails = [
          [ 'codename' => 'event-opening-notice-event-manager' ],
          [ 'codename' => 'event-signin-opening' ],
          [ 'codename' => 'event-host-notification' ],
          [ 'codename' => 'event-signin-remainder' ],
          [ 'codename' => 'event-not-enough-people' ],
          [ 'codename' => 'event-free-place-notification' ],
          [ 'codename' => 'event-remainder' ],
          [ 'codename' => 'host-attendance-check' ],
          [ 'codename' => 'event-manager-attendance-check' ],
          [ 'codename' => 'feedback-notification' ],
          [ 'codename' => 'feedback-remainder' ],
          [ 'codename' => 'event-feedback-stats' ],
        ];

        foreach ($emails as $key => $email) {
            $tag = $email['codename'].'-'.$emailTagBase;
            $emails[$key]['wasSent'] = false;
            $emails[$key]['order'] = $key;
            $emails[$key]['codename'] = Str::camel($emails[$key]['codename']);

            $eventTypes = [
              'accepted',
              'delivered',
              'opened',
              'clicked',
            ];

            try {
                $response = Mailgun::api()->get(env('MAILGUN_DOMAIN')."/tags/".urlencode($tag));
            } catch (Mailgun\Connection\Exceptions\MissingEndpoint $e) {
                continue;
            }

            foreach ($eventTypes as $eventType) {
                $query = ['event' => $eventType, 'duration' => '3m'];
                $response = Mailgun::api()->get(env('MAILGUN_DOMAIN')."/tags/".urlencode($tag).'/stats', $query);
                $emails[$key][$eventType] = collect($response->http_response_body->stats)->sum(function ($resolution) use ($eventType) {
                    if (isset($resolution->$eventType->unique)) {
                        return $resolution->$eventType->unique;
                    }
                    return $resolution->$eventType->total;
                });
            }

            $emails[$key]['wasSent'] = true;
        }

        return $emails;
    }

    public function getHostlist($termId) {
        $user = \Auth::user();

        $term = NxEventTerm::findOrFail($termId);
        if ($term->hostId !== $user->id) {
            return response()->json('', 400);
        }

        $attendees = $term->attendees()
            ->wherePivot('signedIn', '!=', null)
            ->wherePivot('signedIn', '!=', '')
            ->get();

        $attendees = $attendees->sort(function ($a, $b) {
            return strcmp(
                iconv('utf-8', 'ascii//TRANSLIT', $a->user->lastName),
                iconv('utf-8', 'ascii//TRANSLIT', $b->user->lastName)
            );
        })->values()->all();

        $pdf = \PDF::loadView('exports.hostlist', [
            'attendees' => $attendees,
            'eventName' => $term->event->name,
            'date' => $term->eventStartDateTime->format('j. n. Y \o H:i'),
        ]);
        return $pdf->download('attendees.pdf');
    }

    public function getBeforeEventQuestionnaire($eventId)
    {
        $event = NxEvent::findOrFail($eventId);

        return response()->json($this->beforeEventQuestionnaireTransformer->transform($event));
    }

    public function getNxEventsList()
    {
        $events = NxEvent::select('id', 'name', 'semesterId', 'activityPoints')->get();
        return response()->json($events);
    }
}
