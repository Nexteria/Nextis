<?php namespace App\Transformers;

use App\Transformers\QuestionFormTransformer;

class BeforeEventQuestionnaireTransformer extends Transformer
{

    public function transform($event)
    {
        $transformer = new QuestionFormTransformer();
        $form = $transformer->transform($event->form);

        return [
          'id' => (int) $event->id,
          'questionForm' => $form,
        ];
    }
}
