<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Image extends Model
{

    use SoftDeletes;

    protected $table = 'images';
    protected $dates = ['deleted_at'];
    protected $fillable = [
        'title',
        'description',
        'image'
    ];

    public static function store($attributes)
    {
        $image = new Image();

        if (isset($attributes['title'])) {
            $image->title = $attributes['title'];
        }

        if (isset($attributes['description'])) {
            $image->description = $attributes['description'];
        }

        $file = $attributes['file'];
        $token = bin2hex(openssl_random_pseudo_bytes(16));
        $extension = $file->getClientOriginalExtension();
        $timestamp = str_replace([' ', ':'], '-', Carbon::now()->toDateTimeString());
        
        $name = $token. '_' .$timestamp.'.'.$extension;
        $image->filePath = '/uploads/images/'.$name;

        $file->move(public_path().'/uploads/images/', $name);
        $image->ownerId = \Auth::user()->id;
        $image->save();

        return $image;
    }

    public function owner()
    {
        return $this->hasOne('App\User', 'ownerId');
    }

    public function getFilePathAttribute($value)
    {
        return env('APP_URL').$value;
    }
}
