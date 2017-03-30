<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\Role;

class GetGoogleUserRefreshToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'google:getRefreshToken';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get user`s google refresh token for our app';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $client = new \Google_Client();
        $client->setApplicationName(env('GOOGLE_APPLICATION_NAME', ''));
        $client->setScopes(implode(' ', ['https://www.googleapis.com/auth/forms']));
        $client->setAuthConfig(env('GOOGLE_SECRET_JSON_LOCATION', ''));
        $client->setAccessType('offline');

        // Load previously authorized credentials from a file.
        $credentialsPath = env('GOOGLE_AUTH_TOKEN_JSON_LOCATION', '');
        if (file_exists($credentialsPath)) {
            $accessToken = json_decode(file_get_contents($credentialsPath), true);
        } else {
            // Request authorization from the user.
            $authUrl = $client->createAuthUrl();
            $this->info("Open the following link in your browser: ".$authUrl);
            
            $authCode = $this->secret('Enter verification code:');

            // Exchange authorization code for an access token.
            $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);

            // Store the credentials to disk.
            if (!file_exists(dirname($credentialsPath))) {
                mkdir(dirname($credentialsPath), 0700, true);
            }
            file_put_contents($credentialsPath, json_encode($accessToken));

            $this->info("Access token saved to: ".$credentialsPath);
        }

        $client->setAccessToken($accessToken);

        $this->info("Your refresh token is: ".$client->getRefreshToken());
        

        // Refresh the token if it's expired.
        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
        }

        return $client;
    }
}
