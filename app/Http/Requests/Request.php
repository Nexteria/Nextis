<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class Request extends FormRequest
{
    public function all()
    {
        /*
         * Fixes an issue with FormRequest-based requests not
         * containing parameters added / modified by middleware
         * due to the FormRequest copying Request parameters
         * before the middleware is run.
         *
         * See:
         * https://github.com/laravel/framework/issues/10791
         */
        $this->merge($this->request->all());

        return parent::all();
    }
}
