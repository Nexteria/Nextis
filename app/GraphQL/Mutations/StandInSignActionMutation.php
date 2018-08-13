<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\NxEventAttendee;
use App\NxEvent;
use App\Student;
use Carbon\Carbon;

class StandInSignActionMutation extends Mutation
{

    protected $attributes = [
        'name' => 'StandInSignAction'
    ];
    
    public function type()
    {
        return GraphQL::type('NxEventAttendee');
    }
    
    public function args()
    {
        return [
            'studentId' => [
                'name' => 'studentId',
                'type' => Type::nonNull(Type::int()),
                'rules' => ['required'],
            ],
            'eventId' => [
                'name' => 'eventId',
                'type' => Type::nonNull(Type::int()),
                'rules' => ['required'],
            ],
            'action' => [
                'name' => 'action',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['string', 'in:SIGN_IN,SIGN_OUT'],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user) {
            return null;
        }

        $student = Student::where('id', $args['studentId'])
            ->where('userId', $user->id)
            ->firstOrFail();

        $event = NxEvent::findOrFail($args['eventId']);

        $attendee = $event->attendees()
            ->where('userId', $user->id)
            ->firstOrFail();

        if ($args['action'] === 'SIGN_IN' && ($attendee->standIn || $attendee->signedIn)) {
            throw new \Exception("Prihlásiť sa ako náhradník nie je možné ak už si prihlásený", 1);
        }

        if ($args['action'] === 'SIGN_OUT' && !$attendee->standIn) {
            throw new \Exception("Nepodarilo sa odhlásiť z náhradníkov. Nie si prihlásený!", 1);
        }

        // TODO: should we allow sign as standing for exclusionary events?
        if ($args['action'] === 'SIGN_IN') {
            $attendee->standIn = Carbon::now();
        } else {
            $attendee->standIn = null;
        }
        
        $attendee->save();

        return $attendee;
    }

}