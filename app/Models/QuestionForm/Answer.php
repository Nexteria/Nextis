<?php namespace App\Models\QuestionForm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Traits\Uuid;

class Answer extends Model
{
    use SoftDeletes;
    use Uuid;

    public $incrementing = false;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'id',
        'userId',
        'choiceId',
        'answer',
    ];

    public function choice()
    {
        return $this->belongsTo('App\Models\QuestionForm\Choice', 'choiceId');
    }

    public function user()
    {
        return $this->belongsTo('App\User', 'userId');
    }

    public function getQuestion()
    {
        return $this->choice->question;
    }
}
