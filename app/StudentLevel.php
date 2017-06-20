<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentLevel extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    protected $dates = ['deleted_at'];

    public function students()
    {
        return $this->HasMany('App\Student', 'studentLevelId');
    }

    public function userGroup()
    {
        return $this->belongsTo('App\UserGroup', 'user_group_id');
    }
}
