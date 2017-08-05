<?php namespace App\Transformers;

class QuestionFormTransformer extends Transformer
{

    public function transform($form)
    {
        $transformer = new QuestionTransformer();
        $questions = $transformer->transformCollection($form->questions);

        return [
          'id' => $form->id,
          'name' => $form->name,
          'userId' => $form->userId,
          'description' => $form->description,
          'questions' => $questions,
        ];
    }
}
