<?php namespace App\FeedbackForms;

use Collective\Html\HtmlFacade as HTML;
use Illuminate\Support\Facades\App as App;

class FeedbackForms
{

    /**
     * Validate a feedback edit form link.
     *
     * @param  string  $formUrl
     * @return string
     */
    public static function validate($formUrl)
    {
        $client = new \Google_Client();
        $client->setApplicationName(env('GOOGLE_APPLICATION_NAME', ''));
        $client->setScopes(implode(' ', ['https://www.googleapis.com/auth/forms']));
        $client->setAuthConfig(env('GOOGLE_SECRET_JSON_LOCATION', ''));
        $client->setAccessType('offline');

        // Load previously authorized credentials from a file.
        $credentialsPath = env('GOOGLE_AUTH_TOKEN_JSON_LOCATION', '');
        $accessToken = json_decode(file_get_contents($credentialsPath), true);
        $client->setAccessToken($accessToken);

        // Refresh the token if it's expired.
        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
        }

        $request = new \Google_Service_Script_ExecutionRequest();
        $request->setFunction('validateForm');
        $request->setParameters($formUrl);
        
        $service = new \Google_Service_Script($client);
        try {
            // Make the API request.
            $response = $service->scripts->run(env('GOOGLE_SCRIPT_ID', ''), $request);

            if ($response->getError()) {
                // The API executed, but the script returned an error.

                // Extract the first (and only) set of error details. The values of this
                // object are the script's 'errorMessage' and 'errorType', and an array of
                // stack trace elements.
                $error = $response->getError()['details'][0];
                \Log::error("Script error message: ".$error['errorMessage']);

                if (array_key_exists('scriptStackTraceElements', $error)) {
                    // There may not be a stacktrace if the script didn't start executing.
                    \Log::error("Script error stacktrace:\n");
                    foreach ($error['scriptStackTraceElements'] as $trace) {
                        \Log::error("\t".$trace['function']." ".$trace['lineNumber']);
                    }
                }

                return [
                    'code' => 500,
                    'error' => 'Fatal error! Please contact NxSpace Admin!',
                ];
            } else {
                // The structure of the result will depend upon what the Apps Script
                // function returns. Here, the function returns an Apps Script Object
                // with String keys and values, and so the result is treated as a
                // PHP array (folderSet).
                $resp = $response->getResponse();
                return json_decode($resp['result'], true);
            }
        } catch (\Exception $e) {
            // The API encountered a problem before the script started executing.
            \Log::error('Caught exception: '.$e->getMessage()."\n");
            return [
                'code' => 500,
                'error' => 'Fatal error! Please contact NxSpace Admin!',
            ];
        }
    }

    /**
     * Check respondents of the form
     *
     * @param  string  $formUrl
     * @return string
     */
    public static function getRespondents($formUrl)
    {
        $client = new \Google_Client();
        $client->setApplicationName(env('GOOGLE_APPLICATION_NAME', ''));
        $client->setScopes(implode(' ', ['https://www.googleapis.com/auth/forms']));
        $client->setAuthConfig(env('GOOGLE_SECRET_JSON_LOCATION', ''));
        $client->setAccessType('offline');

        // Load previously authorized credentials from a file.
        $credentialsPath = env('GOOGLE_AUTH_TOKEN_JSON_LOCATION', '');
        $accessToken = json_decode(file_get_contents($credentialsPath), true);
        $client->setAccessToken($accessToken);

        // Refresh the token if it's expired.
        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
        }

        $request = new \Google_Service_Script_ExecutionRequest();
        $request->setFunction('getRespondents');
        $request->setParameters($formUrl);
        
        $service = new \Google_Service_Script($client);
        try {
            // Make the API request.
            $response = $service->scripts->run(env('GOOGLE_SCRIPT_ID', ''), $request);

            if ($response->getError()) {
                // The API executed, but the script returned an error.

                // Extract the first (and only) set of error details. The values of this
                // object are the script's 'errorMessage' and 'errorType', and an array of
                // stack trace elements.
                $error = $response->getError()['details'][0];
                \Log::error("Form: ".$formUrl." Script error message: ".$error['errorMessage']);

                if (array_key_exists('scriptStackTraceElements', $error)) {
                    // There may not be a stacktrace if the script didn't start executing.
                    \Log::error("Form: ".$formUrl." Script error stacktrace:\n");
                    foreach ($error['scriptStackTraceElements'] as $trace) {
                        \Log::error("\t".$trace['function']." ".$trace['lineNumber']);
                    }
                }

                throw new \Exception("Error during checking respondents", 1);
            } else {
                // The structure of the result will depend upon what the Apps Script
                // function returns. Here, the function returns an Apps Script Object
                // with String keys and values, and so the result is treated as a
                // PHP array (folderSet).
                $resp = $response->getResponse();
                return json_decode($resp['result'], true);
            }
        } catch (\Exception $e) {
            // The API encountered a problem before the script started executing.
            \Log::error('Form: '.$formUrl.' Caught exception: '.$e->getMessage()."\n");
            throw new \Exception("Error during checking respondents", 1);
        }
    }
}
