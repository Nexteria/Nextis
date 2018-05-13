<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class PaymentCategory extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function user()
    {
        return $this->belongsTo('App\User', 'userId');
    }
    
    public function addedBy()
    {
        return $this->belongsTo('App\User', 'addedBy');
    }

    public function payments()
    {
        return $this->hasMany('App\Payment', 'categoryId');
    }
}
