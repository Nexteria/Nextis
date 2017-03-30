<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\NxEvent;

class EventAttendeePlaceReleased
{
    use InteractsWithSockets, SerializesModels;

    public $nxEvent;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(NxEvent $event)
    {
        $this->nxEvent = $event;
    }
}
