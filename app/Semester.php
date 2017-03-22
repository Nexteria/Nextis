<?php

namespace App;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Semester extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'startDate',
        'endDate',
    ];

    public function events()
    {
        return $this->belongsToMany('App\NxEvent');
    }
}
