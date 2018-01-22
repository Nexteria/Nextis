<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Guide extends Model implements AuditableContract
{
    use Auditable;
    use SoftDeletes;

    protected $fillable = [
        'firstName',
        'lastName',
        'email',
        'linkedInUrl',
        'currentOccupation',
        'profileImageId',
    ];

    protected $casts = [
        'id' => 'integer',
        'userId' => 'integer',
        'lastModifiedUserId' => 'integer',
    ];

    public function fields()
    {
        return $this->hasMany('App\Models\GuideField', 'guideId');
    }

    public function user()
    {
        return $this->belongsTo('App\User', 'userId');
    }

    public function modifiedUser()
    {
        return $this->belongsTo('App\User', 'lastModifiedUserId');
    }

    public function profilePicture()
    {
        return $this->belongsTo('App\Image', 'profileImageId');
    }
}
