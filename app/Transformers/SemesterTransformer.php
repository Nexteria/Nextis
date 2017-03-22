<?php namespace App\Transformers;

class SemesterTransformer extends Transformer
{

    public function transform($semester)
    {
        return [
          'id' => (int) $semester->id,
          'name' => $semester->name,
          'startDate' => $semester->startDate,
          'endDate' => $semester->endDate,
        ];
    }
}
