<?php namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends \BrianFaust\Commentable\Comment
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
}
