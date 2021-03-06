<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReceivedUnknownPaymentConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $payment;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\Payment $payment)
    {
        $this->user = $payment->user;
        $this->payment = $payment;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->user->email)
            ->subject(trans('emails.payment_confirmation_title'))
            ->view('emails.unknown_payment_confirmation');
        
        $this->withSwiftMessage(function ($message) {
            $message->getHeaders()
                    ->addTextHeader('X-Mailgun-Tag', 'uncategorized-payment');
        });
    }
}
