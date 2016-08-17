<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\NxEvent as NxEvent;
use App\UserGroup as UserGroup;
use App\User as User;

class NxEventsController extends Controller
{
    /**
     * @var \App\Transformers\NxEventTransformer
     */
    protected $nxEventTransformer;

    function __construct(\App\Transformers\NxEventTransformer $nxEventTransformer)
    {
        $this->nxEventTransformer = $nxEventTransformer;
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
}
