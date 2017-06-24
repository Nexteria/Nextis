<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewStudentsWelcome extends Mailable
{
    use Queueable, SerializesModels;

    public $password;
    public $firstName;
    public $email;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email, $firstName, $password)
    {
        $this->firstName = $firstName;
        $this->password = $password;
        $this->email = $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->email)
                    ->subject('[NLA] Space Welcome')
                    ->view('emails.new_students_welcome');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'new-students-welcome');
        });
    }
}
