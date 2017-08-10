<?php namespace App\Models\QuestionForm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Traits\Uuid;

class Question extends Model
{
    use SoftDeletes;
    use Uuid;

    public $incrementing = false;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'id',
        'formId',
        'userId',
        'question',
        'type',
        'required',
        'order',
        'minSelection',
        'maxSelection',
    ];

    public function choices()
    {
        return $this->hasMany('App\Models\QuestionForm\Choice', 'questionId');
    }

    public function dependencies()
    {
        return $this->belongsToMany('App\Models\QuestionForm\Choice', 'question_dependencies', 'questionId', 'choiceId');
    }

    public function attendeesGroups()
    {
        return $this->belongsToMany('App\AttendeesGroup', 'attendee_group_question', 'questionId', 'attendeeGroupId');
    }
}
