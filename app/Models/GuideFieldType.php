<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class GuideFieldType extends Model implements AuditableContract
{
    use Auditable;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'codename',
        'required',
        'order',
    ];

    protected $casts = [
        'id' => 'integer',
        'userId' => 'integer',
    ];
}
