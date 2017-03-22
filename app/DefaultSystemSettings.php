<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class DefaultSystemSettings extends Model
{
    protected $fillable = [
        'codename',
        'value',
    ];

    public static function get($setting)
    {
        return self::where('codename', '=', $setting)->first()->value;
    }

    public static function set($setting, $value)
    {
        $item = self::where('codename', '=', $setting)->first();
        $item->value = $value;
        $item->save();
    }

    public static function getNxEventsSettings()
    {
        $settings = [
          'feedbackEmailDelay' => (int) DefaultSystemSettings::get('feedbackEmailDelay'),
          'feedbackDaysToFill' => (int) DefaultSystemSettings::get('feedbackDaysToFill'),
          'feedbackRemainderDaysBefore' => (int) DefaultSystemSettings::get('feedbackRemainderDaysBefore'),
        ];

        return $settings;
    }
}
