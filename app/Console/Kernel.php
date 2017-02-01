<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Carbon\Carbon;
use App\User;
use App\Role;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\InviteUser::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $tuitionSettings = \App\TuitionDefaultSettings::first();
        $schedule->call(function () {
            $day = Carbon::now()->day;
            $month = Carbon::now()->month;
            $year = Carbon::now()->year;

            $tuitionSettings = \App\TuitionDefaultSettings::first();
            if (!in_array($month - 1, $tuitionSettings->schoolFeeApplicableMonths)) {
                return;
            }

            $isDefaultGenerationDay = true;
            if ($tuitionSettings->generationSchoolFeeDay !== $day) {
                $isDefaultGenerationDay = false;
            }
            

            $activeStudents = Role::where('name', 'STUDENT')
                                  ->first()
                                  ->users()
                                  ->where('state', \Config::get('constants.states.ACTIVE'))
                                  ->get();

            foreach ($activeStudents as $user) {
                $paymentSettings = $user->paymentSettings;

                if ($paymentSettings) {
                    if ($paymentSettings->generationSchoolFeeDay !== $day ||
                      $paymentSettings->disableSchoolFeePayments) {
                        continue;
                    }
                } elseif (!$isDefaultGenerationDay) {
                    continue;
                }

                $user->generateMonthlySchoolFee($month - 1, $year, 1);
            }
        })->dailyAt('1:00');

        $schedule->call(function () {

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
        })->dailyAt('23:05');
    }
}
