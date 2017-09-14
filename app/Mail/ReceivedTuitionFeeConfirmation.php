<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Payment;
use Carbon\Carbon;

class ReceivedTuitionFeeConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $payment;
    public $debtAmount;
    public $isAfterDeadline;
    public $daysAfter;

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
        $payments = Payment::where('variableSymbol', $this->payment->variableSymbol)->orderBy('created_at', 'desc')->get();

        $debetAmountBeforeDL = 0;
        $debetAmountAfterDL = 0;
        $kreditAmount = 0;
        $oldestDeadline = Carbon::now();
        $debetPayments = $payments->filter(function ($item) use (&$kreditAmount, &$debetAmountBeforeDL, &$debetAmountAfterDL, &$oldestDeadline) {
            if ($item->transactionType === 'debet') {
                if ($item->deadline_at != null) {
                    $deadline = Carbon::createFromFormat('Y-m-d', $item->deadline_at);
                    if ($oldestDeadline->gt($deadline)) {
                        $oldestDeadline = $deadline;
                    }

                    if (Carbon::now()->gt($deadline)) {
                        $debetAmountAfterDL += $item->amount;
                    } else {
                        $debetAmountBeforeDL += $item->amount;
                    }
                } else {
                    $debetAmountBeforeDL += $item->amount;
                }
            } else {
                $kreditAmount += $item->amount;
            }

            return $item->transactionType === 'debet';
        });

        $isAfterDeadline = (($kreditAmount - $debetAmountAfterDL - $this->payment->amount) < 0);
        if ($isAfterDeadline) {
            $debetAmount = ($kreditAmount - $debetAmountAfterDL - $this->payment->amount);
            foreach ($debetPayments->sortByDesc('created_at') as $debetPayment) {
                if (!$debetPayment->deadline_at) {
                    continue;
                }

                $debetAmount += $debetPayment->amount;
                if ($debetAmount >= 0) {
                    $oldestDeadline = Carbon::createFromFormat('Y-m-d', $debetPayment->deadline_at);
                    break;
                }
            }
        }
        $this->debtAmount = $debetAmountAfterDL - $kreditAmount;

        Carbon::setLocale('sk');
        $this->daysAfter = Carbon::now()->diffForHumans($oldestDeadline);

        if ($this->debtAmount > 0) {
            return $this->to($this->user->email)
                        ->subject(trans('emails.payment_confirmation_title'))
                        ->view('emails.tuition_payment_confirmation_debt');
        }
        
        if ($isAfterDeadline) {
            return $this->to($this->user->email)
                        ->subject(trans('emails.payment_confirmation_title'))
                        ->view('emails.tuition_payment_confirmation_late');
        }

        return $this->to($this->user->email)
                    ->subject(trans('emails.payment_confirmation_title'))
                    ->view('emails.tuition_payment_confirmation_all_ok');
    }
}
