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
        \Log::error($choicesIds);
        \Log::error($userId);
        \Log::error($this->id);
        $query = Answer::whereIn('choiceId', $choicesIds);

        if ($userId) {
            $query = $query->where('userId', $userId);
        }

        \Log::error($query->toSql());
        $answers = $query->get();
        \Log::error($answers);

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
