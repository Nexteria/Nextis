<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\User;
use App\Image;

class NxLocation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'addressLine1',
        'addressLine2',
        'city',
        'zipCode',
        'countryCode',
    ];

    public static function createNew($attributes = [])
    {
        $location = new NxLocation($attributes);
        $location->ownerId = \Auth::user()->id;
        $location->description = clean($attributes['description']);
        $location->instructions = clean($attributes['instructions']);
        $location->save();

        if ($attributes['pictures']) {
            $location->pictures()->sync(Image::whereIn('id', $attributes['pictures'])->pluck('id')->toArray());
        }

        $location->save();
        return $location;
    }

    public function updateData($attributes)
    {
        $this->fill($attributes);

        $this->ownerId = \Auth::user()->id;

        if (isset($attributes['description'])) {
            $this->description = clean($attributes['description']);
        }

        if (isset($attributes['instructions'])) {
            $this->instructions = clean($attributes['instructions']);
        }

        if ($attributes['pictures']) {
            $this->pictures()->sync(Image::whereIn('id', $attributes['pictures'])->pluck('id')->toArray());
        }

        $this->save();
    }

    public function pictures()
    {
        return $this->belongsToMany('App\Image');
    }
}
