<?php

namespace App\GraphQL\Type;

use App\PaymentCategory;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class PaymentCategoryType extends GraphQLType
{
    protected $attributes = [
        'name' => 'paymentCategory',
        'description' => 'Payment category',
        'model' => PaymentCategory::class,
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::int(),
                'description' => 'The id of payment category',
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'The name of payment category',
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'The description of payment category',
            ],
            'variableSymbol' => [
                'type' => Type::string(),
                'description' => 'The variable symbol associated with this payment category',
            ],
            'userId' => [
                'type' => Type::int(),
                'description' => 'The id of user which owns this payment category',
            ],
            'addedBy' => [
                'type' => Type::int(),
                'description' => 'The id of user who created category',
            ],
            'created_at' => [
                'type' => Type::string(),
                'description' => 'The datetime of when the payment category was received',
            ],
            'updated_at' => [
                'type' => Type::string(),
                'description' => 'The datetime of when the payment category was last time updated',
            ],
            'payments' => [
                'type' => Type::listOf(GraphQL::type('payment')),
                'description' => 'The payments which belongs to this category',
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
}
