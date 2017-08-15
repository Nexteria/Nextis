<?php namespace App\Transformers;

use App\Transformers\QuestionFormTransformer;

class BeforeEventQuestionnaireTransformer extends Transformer
{

    public function transform($event)
    {
        $transformer = new QuestionFormTransformer();
        $form = $event->form ? $transformer->transform($event->form) : null;

        return [
          'id' => (int) $event->id,
          'questionForm' => $form,
        ];
    }
}
