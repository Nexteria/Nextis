<?php

namespace App\GraphQL\Type;

use App\Image;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Type as GraphQLType;

class ImageType extends GraphQLType
{
    protected $attributes = [
        'name' => 'image',
        'description' => 'Image',
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::int(),
                'description' => 'The id of the image',
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'Description of the image',
            ],
            'title' => [
                'type' => Type::string(),
                'description' => 'The for the image',
            ],
            'filePath' => [
                'type' => Type::string(),
                'description' => 'The filepath of the image.',
            ],
        ];
    }
}
