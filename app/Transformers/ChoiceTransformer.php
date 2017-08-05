<?php namespace App\Transformers;

class ChoiceTransformer extends Transformer
{

    public function transform($choice)
    {
        return [
            'id' => $choice->id,
            'questionId' => $choice->questionId,
            'userId' => $choice->userId,
            'title' => $choice->title,
            'order' => $choice->order,
        ];
    }
}
