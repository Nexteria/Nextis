<?php namespace App\FeedbackForms\Facades;

use Illuminate\Support\Facades\Facade;

class FeedbackForms extends Facade
{

    protected static function getFacadeAccessor()
    {
        return 'feedbackforms';
    }
}
