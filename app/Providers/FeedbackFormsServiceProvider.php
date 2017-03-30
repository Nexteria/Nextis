<?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class FeedbackFormsServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind('feedbackforms', 'App\FeedbackForms\FeedbackForms');
    }
}
