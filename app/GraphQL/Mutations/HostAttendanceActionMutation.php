<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\NxEventAttendee;
use App\NxEventTerm;
use Carbon\Carbon;

class HostAttendanceActionMutation extends Mutation
{

    protected $attributes = [
        'name' => 'HostAttendanceAction'
    ];
    
    public function type()
    {
        return GraphQL::type('NxTermAttendee');
    }
    
    public function args()
    {
        return [
            'attendeeId' => [
                'name' => 'attendeeId',
                'type' => Type::nonNull(Type::int()),
                'rules' => ['required'],
            ],
            'termId' => [
                'name' => 'termId',
                'type' => Type::nonNull(Type::int()),
            ],
            'wasPresent' => [
                'name' => 'wasPresent',
                'type' => Type::nonNull(Type::boolean()),
                'rules' => ['boolean', 'required'],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user) {
            return null;
        }

        $term = NxEventTerm::findOrFail($args['termId']);

        if ($term->hostId !== $user->id) {
            return respons()->json('', 400);
        }

        $attendee = $term->attendees()->wherePivot('attendeeId', $args['attendeeId'])->firstOrFail();
        
        if ($args['wasPresent']) {
            $attendee->pivot->wasPresent = Carbon::now();
        } else {
            $attendee->pivot->wasPresent = null;
        }

        $attendee->pivot->save();

        return $attendee;
    }

}