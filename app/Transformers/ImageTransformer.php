<?php namespace App\Transformers;

class ImageTransformer extends Transformer
{

    public function transform($image)
    {
        return [
            'id' => (int) $image->id,
            'url' => $image->filePath,
         ];
    }
}
