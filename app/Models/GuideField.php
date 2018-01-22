<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class GuideField extends Model implements AuditableContract
{
    use Auditable;
    use SoftDeletes;

    protected $dateFormat = 'Y-m-d H:i:s';
    protected $dates = ['deleted_at', 'needUpdates'];

    protected $fillable = [
        'value',
    ];

    protected $casts = [
        'id' => 'integer',
        'fieldTypeId' => 'integer',
        'userId' => 'integer',
        'guideId' => 'integer',
    ];

    public function guide()
    {
        return $this->belongsTo('App\Models\Guide', 'guideId');
    }

    public function fieldType()
    {
        return $this->belongsTo('App\Models\GuideFieldType', 'fieldTypeId');
    }
}
