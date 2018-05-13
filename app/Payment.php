<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Payment extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'plainEmail',
        'variableSymbol',
        'specificSymbol',
        'constantSymbol',
        'payersMessage',
        'amount',
        'transactionType',
        'iban',
    ];

    /**
     *   Finds the account number in the email message.
     *   Current implementation works only for IBAN account numbers. See:
     *   https://en.wikipedia.org/wiki/International_Bank_Account_Number
     */
    private function parseOwnerIban()
    {
        $matches = [];
        $email = preg_replace("/[\s>]/", '', $this->email);
        $success = preg_match_all("/[A-Z][A-Z][0-9][0-9][0-9A-Z]{0,30}/", $email, $matches);
        if (!$success) {
            return '';
        }

        return $matches[0][0];
    }

    private function parsePayerIban()
    {
        $matches = [];
        $email = $this->parseDescription();
        $success = preg_match_all("/[A-Z][A-Z][0-9][0-9][0-9A-Z]{0,30}/", $email, $matches);
        if (!$success) {
            return '';
        }

        return $matches[0][0];
    }
  
    /**
     * Parse amount and type of transaction.
     *
     * @return array
     */
    private function parseAmount()
    {
        $matches = [];
        $email = preg_replace("/[\s>]/", '', $this->email);
        $success = preg_match("/(zvyseny|znizeny)[a-zA-Z]*([0-9]+[,|.]?[0-9]*)eur/i", $email, $matches);
        if (!$success) {
            return '';
        }

        $result = [
          'type' => $matches[1] === 'znizeny' ? 'debet' : 'kredit',
          'amount' => (int) floatval(str_replace(',', '.', $matches[2])) * 100,
        ];
        
        return $result;
    }

    

    private function parseDescription()
    {
        $matches = [];
        $success = preg_match(
            "/(p[\s>]*o[\s>]*p[\s>]*i[\s>]*s[\s>]*t[\s>]*r[\s>]*a[\s>]*n[\s>]*s[\s>]*a[\s>]*k[\s>]*c[\s>]*i[\s>]*e[\s>]*:)([^\n]*)(\n|$)/i",
            $this->email,
            $matches
        );

        if (!$success) {
            return '';
        }

        return $matches[2];
    }
  
    private function parseSymbols()
    {
        $matches = [];
        $email = preg_replace("/[>]/", '', $this->email);
        $success = preg_match(
            "/r[\s]*e[\s]*f[\s]*e[\s]*r[\s]*e[\s]*n[\s]*c[\s]*i[\s]*a[\s]*p[\s]*l[\s]*a[\s]*t[\s]*i[\s]*t[\s]*e[\s]*l[\s]*a[\s]*:[\s]*([\S]*)(\s|$)/i",
            $email,
            $matches
        );

        $results = [
          'specificSymbol' => '',
          'variableSymbol' => '',
          'constantSymbol' => '',
        ];

        if (!$success) {
            return $results;
        }

        $symbols = explode('/', strtolower($matches[1]));
        foreach ($symbols as$symbol) {
            if (substr($symbol, 0, 2) === 'ss') {
              $results['specificSymbol'] = substr($symbol, 2);
            }

            if (substr($symbol, 0, 2) === 'vs') {
              $results['variableSymbol'] = substr($symbol, 2);
            }

            if (substr($symbol, 0, 2) === 'ks') {
              $results['constantSymbol'] = substr($symbol, 2);
            }
        }

        return $results;
    }

    private function parseMessage()
    {
        $matches = [];
        $success = preg_match(
            "/(i[\s>]*n[\s>]*f[\s>]*o[\s>]*r[\s>]*m[\s>]*a[\s>]*c[\s>]*i[\s>]*a[\s>]*p[\s>]*r[\s>]*e[\s>]*p[\s>]*r[\s>]*i[\s>]*j[\s>]*e[\s>]*m[\s>]*c[\s>]*u[\s>]*:)([^\n]*)(\n|$)/i",
            $this->email,
            $matches
        );

        if (!$success) {
            return '';
        }

        return $matches[2];
    }

    public static function parse($email)
    {
        $payment = new Payment();
        $payment->email = $email;

        $payment->message = $payment->parseMessage();
        $symbols = $payment->parseSymbols();
        $payment->specificSymbol = $symbols['specificSymbol'];
        $payment->variableSymbol = (int) $symbols['variableSymbol'];
        $payment->constantSymbol = $symbols['constantSymbol'];

        $payment->description = $payment->parseDescription();

        $amount = $payment->parseAmount();
        $payment->amount = $amount['amount'];
        $payment->transactionType = $amount['type'];

        $payment->ownerIban = $payment->parseOwnerIban();
        $payment->payerIban = $payment->parsePayerIban();

        if ($payment->variableSymbol) {
            $vsPayment = Payment::where('transactionType', '=', 'debet')
                                ->where('variableSymbol', '=', $payment->variableSymbol)->first();
            if ($vsPayment) {
                $user = $vsPayment->user;
                $payment->userId = $user->id;
            } else {
                $student = \App\Student::where('tuitionFeeVariableSymbol', $payment->variableSymbol)
                                        ->first();
                if ($student) {
                    $payment->userId = $student->userId;
                }
            }
        }

        if ($payment->payerIban && !$payment->userId) {
            $user = User::where('iban', '=', $payment->payerIban);
            if ($user->count() === 1) {
                $user = $user->first();
                $payment->userId = $user->id;
            }
        }

        $payment->save();
        return $payment;
    }

    public function user()
    {
        return $this->belongsTo('App\User', 'userId');
    }

    public function paymentCategory()
    {
        return $this->belongsTo('App\PaymentCategory', 'categoryId');
    }
}
