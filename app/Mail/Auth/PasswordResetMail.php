<?php

namespace App\Mail\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userFirstName;
    public $userEmail;
    public $token;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\User $user, $token)
    {
        $this->userFirstName = $user->firstName;
        $this->userEmail = $user->email;
        $this->token = $token;
    }


    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->userEmail)
                    ->subject('Nexteria Space - zmena hesla')
                    ->view('emails.auth.password_reset');
    }

}
