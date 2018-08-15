<?php

namespace App\Http\Middleware;

use Closure;

class SentryContext
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (app()->bound('sentry')) {
            /** @var \Raven_Client $sentry */
            $sentry = app('sentry');

            $user = \Auth::user();
            if ($user) {
                $sentry->user_context([
                    'id' => $user->id,
                    'firstName' => $user->firstName,
                    'lastName' => $user->lastName,
                ]);
            } else {
                $sentry->user_context(['id' => null]);
            }
        }

        return $next($request);
    }
}