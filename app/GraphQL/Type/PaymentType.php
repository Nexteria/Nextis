<?php

namespace App\GraphQL\Type;

use App\Payment;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class PaymentType extends GraphQLType
{
    protected $attributes = [
        'name' => 'payment',
        'description' => 'Payment',
        'model' => Payment::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::int(),
                'description' => 'The id of payment',
            ],
            'amount' => [
                'type' => Type::int(),
                'description' => 'The amount',
            ],
            'transactionType' => [
                'type' => Type::string(),
                'description' => 'The type of payment',
            ],
            'message' => [
                'type' => Type::string(),
                'description' => 'The message of payment',
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'The description of payment',
            ],
            'variableSymbol' => [
                'type' => Type::string(),
                'description' => 'The variable symbol associated with this payment',
            ],
            'userId' => [
                'type' => Type::int(),
                'description' => 'The id of user which owns this payment',
            ],
            'addedByUserId' => [
                'type' => Type::int(),
                'description' => 'The id of user who granted points',
            ],
            'created_at' => [
                'type' => Type::string(),
                'description' => 'The datetime of when the payment was received',
            ],
            'updated_at' => [
                'type' => Type::string(),
                'description' => 'The datetime of when the payment was last time updated',
            ],
            'deadline_at' => [
                'type' => Type::string(),
                'description' => 'The date of when the payment must be payed',
            ],
            'valid_from' => [
                'type' => Type::string(),
                'description' => 'The date of when the payment is valid',
            ],
            'paymentCategory' => [
                'type' => GraphQL::type('paymentCategory'),
                'description' => 'The payments category for this payment',
            ],
        ];
    }

    public function resolveCreatedAtField($root)
    {
        return (string) $root->created_at;
    }

    public function resolveUpdatedAtField($root)
    {
        return (string) $root->updated_at;
    }

    public function resolveDeadlineAtField($root)
    {
        return (string) $root->deadline_at;
    }

    public function resolveValidFromField($root)
    {
        return (string) $root->valid_from;
    }
}
