<?php namespace App\Transformers;

class PaymentTransformer extends Transformer
{

    public function transform($payment)
    {
        return [
          'id' => (int) $payment->id,
          'userId' => (int) $payment->userId,
          'amount' => (int) $payment->amount,
          'transactionType' => $payment->transactionType,
          'variableSymbol' => $payment->variableSymbol,
          'specificSymbol' => $payment->specificSymbol,
          'constantSymbol' => $payment->constantSymbol,
          'message' => $payment->message,
          'createdAt' => $payment->created_at ? $payment->created_at->__toString() : null,
        ];
    }
}
