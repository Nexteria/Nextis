<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\User;

class SendCorrectionEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:correctionMail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends correction email';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $users = User::whereIn('id', [])->get();
        foreach ($users as $user) {
            $email = new \App\Mail\Events\CorrectionMail($user);
            \Mail::send($email);
        }
    }
}
