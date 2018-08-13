<?php namespace App\GraphQL;

use GraphQL\Error\Error;

class ErrorFormatter {

    public static function formatError(Error $e)
    {
        \Log::error($e);

        $error = [
            'message' => $e->getMessage()
        ];

        $locations = $e->getLocations();
        if(!empty($locations))
        {
            $error['locations'] = array_map(function($loc)
            {
                return $loc->toArray();
            }, $locations);
        }

        $previous = $e->getPrevious();
        if($previous && $previous instanceof ValidationError)
        {
            $error['validation'] = $previous->getValidatorMessages();
        }

        return $error;
    }
}
