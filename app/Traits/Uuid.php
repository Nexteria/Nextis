<?php
namespace App\Traits;

use Webpatser\Uuid\Uuid as UuidProvider;

trait Uuid
{

    /**
     * Boot function from laravel.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->{$model->getKeyName()}) {
                $model->{$model->getKeyName()} = UuidProvider::generate()->string;
            }
        });
    }
}
