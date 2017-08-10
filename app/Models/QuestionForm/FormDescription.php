<?php namespace App\Models\QuestionForm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class FormDescription extends Model
{
    use SoftDeletes;

    public $incrementing = false;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'id',
        'formId',
        'userId',
        'attendeeGroupId',
        'description',
    ];

    public function attendeesGroup()
    {
        return $this->belongsTo('App\AttendeesGroup', 'attendeeGroupId');
    }

    public function descriptions()
    {
        return $this->hasMany('App\Models\QuestionForm\FormDescription', 'formId');
    }
}
