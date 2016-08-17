<?php namespace App\Transformers;

abstract class Transformer {

    /**
     * Tranform a collection of model
     * 
     * @param $items
     * @return array
     */
    public function transformCollection($items)
    {
        return $items->map(function($item) {
          return $this->transform($item);
        });
    }

    public abstract function transform($item);
}