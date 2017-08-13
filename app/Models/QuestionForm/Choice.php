<?php namespace App\Models\QuestionForm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Traits\Uuid;

class Choice extends Model
{
    use SoftDeletes;
    use Uuid;

    public $incrementing = false;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'id',
        'userId',
        'questionId',
        'title',
        'order',
    ];

    public function dependants()
    {
        return $this->belongsToMany('App\Models\QuestionForm\Question', 'question_dependencies', 'choiceId', 'questionId');
    }

    public function question()
    {
        return $this->belongsTo('App\Models\QuestionForm\Question', 'questionId');
    }

    public function answers()
    {
        return $this->hasMany('App\Models\QuestionForm\Answer', 'choiceId');
    }
}
