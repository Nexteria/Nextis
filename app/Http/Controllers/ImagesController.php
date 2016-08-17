<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Image;
use Illuminate\Http\Request;

class ImagesController extends Controller
{

    /**
     * @var \App\Transformers\ImageTransformer
     */
    protected $imageTransformer;

    public function __construct(\App\Transformers\ImageTransformer $imageTransformer)
    {
        $this->imageTransformer = $imageTransformer;
    }
   
    public function uploadPicture()
    {
        $image = Image::store(\Input::all());

        return response()->json($this->imageTransformer->transform($image));
    }
}
