<?php namespace App\Transformers;

abstract class Transformer {

    /**
     * Tranform a collection of model
     * 
     * @param $items
     * @return array
     */
    public function transformCollection($items, $fields = [])
    {
        return $items->map(function($item) use ($fields) {
          return $this->transform($item, $fields);
        });
    }

    public abstract function transform($item);
}