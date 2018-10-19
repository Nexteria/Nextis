<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\App as App;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if (App::environment('local') && env('DISABLE_AUTH', false)) {
            if (Auth::guard($guard)->guest()) {
                \Auth::loginUsingId(env('AUTH_USER_ID'));
            }
            return $next($request);
        }

        if (Auth::guard($guard)->guest()) {
            if ($request->ajax() || $request->wantsJson() || $request->expectsJson()) {
                return response()->json('Unauthorized.', 401);
            } else {
                return redirect()->guest('login?redirect='.$request->path());
            }
        }

        return $next($request);
    }
}
