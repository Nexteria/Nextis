<?php namespace App\Models\QuestionForm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Traits\Uuid;

class Form extends Model
{
    use SoftDeletes;
    use Uuid;

    public $incrementing = false;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'id',
        'userId',
        'name',
        'description',
    ];

    public function getUsersAnswers($userId = null)
    {
        $choicesIds = $this->choices()->pluck('choices.id');
        $query = Answer::whereIn('choiceId', $choicesIds);

        if ($userId) {
            $query = $query->where('userId', $userId);
        }

        $answers = $query->get();

        return $answers;
    }

    public function questions()
    {
        return $this->hasMany('App\Models\QuestionForm\Question', 'formId');
    }

    public function choices()
    {
        return $this->hasManyThrough('App\Models\QuestionForm\Choice', 'App\Models\QuestionForm\Question', 'formId', 'questionId', 'id');
    }

    public function event()
    {
        return $this->hasOne('App\NxEvent', 'signInFormId');
    }

    public function descriptions()
    {
        return $this->hasMany('App\Models\QuestionForm\FormDescription', 'formId');
    }
}
