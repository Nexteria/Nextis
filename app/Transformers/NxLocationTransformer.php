<?php namespace App\Transformers;

use App\Transformers\ImageTransformer;

class NxLocationTransformer extends Transformer
{
    public function transform($location)
    {
        $transformer = new ImageTransformer();
        $pictures = $transformer->transformCollection($location->pictures);

        return [
            'id' => (int) $location->id,
            'name' => $location->name,
            'latitude' => $location->latitude,
            'longitude' => $location->longitude,
            'addressLine1' => $location->addressLine1,
            'addressLine2' => $location->addressLine2,
            'city' => $location->city,
            'zipCode' => $location->zipCode,
            'countryCode' => $location->countryCode,
            'description' => $location->description,
            'instructions' => $location->instructions,
            'pictures' => $pictures,
            'createdAt' => $location->created_at->toDateTimeString(),
            'updatedAt' => $location->updated_at->toDateTimeString(),
            'deletedAt' => $location->deleted_at,
         ];
    }
}
