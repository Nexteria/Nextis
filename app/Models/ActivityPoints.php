<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class ActivityPoints extends Model
{
    use SoftDeletes;

    public function student()
    {
        return $this->belongsTo('App\Student', 'studentId');
    }
}
