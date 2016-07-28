<?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ReactServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind('react', 'App\React\React');
    }
}
