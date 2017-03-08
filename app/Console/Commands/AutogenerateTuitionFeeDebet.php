<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;
use App\Role;

class AutogenerateTuitionFeeDebet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autogenerate:tuitionFeeDebet';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if it is day to generate tuition fee debet and if so, generate it';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
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
    }
}
