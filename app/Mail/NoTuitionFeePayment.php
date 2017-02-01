<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NoTuitionFeePayment extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $debtAmount;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\User $user, $debtAmount)
    {
        $this->user = $user;
        $this->debtAmount = $debtAmount;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->to($this->user->email)
                    ->subject(trans('emails.no_tuition_payment_email_title'))
                    ->view('emails.no_tuition_payment');
    }
}
