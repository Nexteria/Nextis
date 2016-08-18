<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        if (\Auth::user() != null) {
            $user_id = \Auth::user()->id;
            $username = \Auth::user()->username;
        } else {
            $user_id = null;
            $username = "NONE";
        }

        $headers = \Request::instance()->headers;
        $query = \Request::instance()->getQueryString();
        $request_content = \Request::instance()->getContent();
        $request_data = $headers.$query.$request_content;

        $time = date('m/d/Y h:i:s a', time());
        $url = \Request::url();
        $data = array('user_id' => $user_id,
                'username' => $username,
                'time' => $time,
                'url' => $url,
                'exception' => $e);


        if (env('MAIL_EXCEPTIONS', false)) {
            \Mail::send(['text' => 'view'], $data, function ($message) {
                $message->from('nextis@space.nexteria.sk', 'Nextis');
                $message->to('dev@space.nexteria.sk', 'Nextis dev team');
                $message->subject("Nextis - exception");
            });
        }

        $format = "\n\nException: %s\nUrl: %s\nUser: %s(%s)\nData:\n%s\nStacktrace:\n %s";
        $message = sprintf($format, $time, $url, $username, $user_id, $request_data, $e);
        \Log::error($message);
        
        parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
        $error = $this->convertExceptionToResponse($e);
        return response()->json([
          "code" => $error->getStatusCode(),
          "message" => $e->getMessage(),
        ], $error->getStatusCode());
    }
}
