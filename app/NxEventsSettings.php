<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class NxEventsSettings extends Model
{
    protected $fillable = [
        'feedbackEmailDelay',
        'feedbackDaysToFill',
        'feedbackRemainderDaysBefore',
        'hostInstructionEmailDaysBefore',
        'eventSignInOpeningManagerNotificationDaysBefore',
        'eventSignInRemainderDaysBefore',
    ];

    public function event()
    {
        return $this->belongsTo('App\NxEvent', 'eventId');
    }
}
