<?php namespace App\Transformers;

class QuestionTransformer extends Transformer
{

    public function transform($question)
    {
        $transformer = new ChoiceTransformer();
        $choices = $transformer->transformCollection($question->choices);

        $dependencies = $question->dependencies;

        $dependentOn = [];
        foreach ($dependencies as $choice) {
            if (isset($dependentOn[$choice->questionId])) {
                $dependentOn[$choice->questionId][] = $choice->id;
            } else {
                $dependentOn[$choice->questionId] = [$choice->id];
            }
        }

        return [
            'id' => $question->id,
            'formId' => $question->formId,
            'userId' => $question->userId,
            'question' => $question->question,
            'type' => $question->type,
            'required' => $question->required,
            'order' => $question->order,
            'minSelection' => $question->minSelection,
            'maxSelection' => $question->maxSelection,
            'choices' => $choices,
            'dependentOn' => $dependentOn,
            'groupSelection' => $question->attendeesGroups->pluck('attendees_groups.id'),
        ];
    }
}
