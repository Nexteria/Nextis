<?php

namespace App\Mail\Guides;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class AssignedGuideMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userFirstName;
    public $guideName;
    public $guideImgUrl;
    public $userEmail;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\Student $student, \App\Models\Guide $guide)
    {
        $this->userFirstName = $student->user->firstName;
        $this->guideName = $guide->firstName.' '.$guide->lastName;
        $this->guideImgUrl = secure_url($guide->profilePicture->filePath);
        $this->userEmail = $student->user->email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->userEmail)
                    ->subject('[NLA Guide] Bol Ti priradený guide')
                    ->view('emails.guides.assigned_guide');

        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'assigned-guide');
        });
    }
}
