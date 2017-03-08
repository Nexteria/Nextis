<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\Role;

class AutogenerateTuitionPaymentNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:tuitionPaymentNotification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if it is day to generate tuition debet notification and if so, generate it';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $tuitionSettings = \App\TuitionDefaultSettings::first();
        $day = Carbon::now()->day;
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;

        if (!in_array($month - 1, $tuitionSettings->schoolFeeApplicableMonths)) {
            return;
        }

        $isDefaultCheckingDay = true;
        if ($tuitionSettings->checkingSchoolFeePaymentsDay !== $day) {
            $isDefaultCheckingDay = false;
        }

        $activeStudents = Role::where('name', 'STUDENT')
                              ->first()
                              ->users()
                              ->where('state', \Config::get('constants.states.ACTIVE'))
                              ->get();

        foreach ($activeStudents as $user) {
            $paymentSettings = $user->paymentSettings;

            if ($paymentSettings) {
                if ($paymentSettings->checkingSchoolFeePaymentsDay !== $day ||
                  $paymentSettings->disableSchoolFeePayments || $paymentSettings->disableEmailNotifications) {
                    continue;
                }
            } elseif (!$isDefaultCheckingDay) {
                continue;
            }

            $payments = \App\Payment::where('variableSymbol', $user->tuitionFeeVariableSymbol)->orderBy('created_at', 'desc')->get();

            $debetAmountBeforeDL = 0;
            $debetAmountAfterDL = 0;
            $kreditAmount = 0;
            $debetPayments = $payments->filter(function ($item) use (&$kreditAmount, &$debetAmountBeforeDL, &$debetAmountAfterDL) {
                if ($item->transactionType === 'debet') {
                    if ($item->deadline_at != null) {
                        $deadline = Carbon::createFromFormat('Y-m-d', $item->deadline_at);
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

            $isAfterDeadline = (($kreditAmount - $debetAmountAfterDL) < 0);
            $debtAmount = $debetAmountAfterDL - $kreditAmount;

            if ($isAfterDeadline) {
                $email = new \App\Mail\NoTuitionFeePayment($user, $debtAmount);
                \Mail::send($email);
            }
        }
    }
}
