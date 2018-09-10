<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class InviteUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invite:user {--user=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send welcome email to new user';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $user = \App\User::find($this->option('user'));
        $data = [
          'userName' => $user->firstName,
          'userEmail' => $user->email,
          'userPassword' => str_random(12),
          'userVariableSymbol' => $user->student->tuitionFeeVariableSymbol,
        ];

        $user->password = \Hash::make($data['userPassword']);
        $user->save();

        \Mail::send('emails.welcome', $data, function($message) use ($user)
        {
            $message->from('noreply@space.nexteria.sk', 'Nexteria Space');
            $message->to($user->email);
            $message->subject("Nexteria Space - vitaj v systéme");
        });
    }
}
