<?php namespace App\Transformers;

class QuestionFormTransformer extends Transformer
{

    public function transform($form)
    {
        $transformer = new QuestionTransformer();
        $questions = $transformer->transformCollection($form->questions);

        $descriptions = [];
        foreach ($form->descriptions as $description) {
            $descriptions[(int) $description->attendeeGroupId] = $description->description;
        }

        return [
          'id' => $form->id,
          'name' => $form->name,
          'userId' => $form->userId,
          'description' => $form->description,
          'groupDescriptions' => $descriptions,
          'questions' => $questions,
        ];
    }
}
