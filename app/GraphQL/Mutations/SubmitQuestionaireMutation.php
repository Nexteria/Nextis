<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\User;
use App\Models\QuestionForm\Form as QuestionForm;
use App\Models\QuestionForm\Question;
use App\Models\QuestionForm\Answer;
use App\Models\QuestionForm\Choice;

class SubmitQuestionaireMutation extends Mutation
{

    protected $attributes = [
        'name' => 'SubmitQuestionaire'
    ];
    
    public function type()
    {
        return Type::boolean();
    }
    
    public function args()
    {
        return [
            'formId' => [
                'name' => 'formId',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
            'answers' => [
                'name' => 'answers',
                'type' => Type::listOf(GraphQL::type('QuestionAnswer')),
                'rules' => ['required'],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $user = \Auth::user();

        if (!$user) {
            return null;
        }

        $form = QuestionForm::findOrFail($args['formId']);

        $savedAnswers = $form->getUsersAnswers($user->id);
        \Log::error($savedAnswers);
        if (count($savedAnswers) > 0) {
            return new \Exception('Dotazník nie je možné vyplniť dva krát!');
        }

        $answers = $args['answers'];
        $questionAnswers = [];
        foreach ($answers as $answer) {
            $questionAnswers[$answer['questionId']] = $answer;
        }

        // validation
        // TODO: check also non required fields
        $requiredQuestions = $form->questions()->where('required', true)->get();
        foreach ($requiredQuestions as $question) {
            $answer = $questionAnswers[$question->id];

            if (!$answer) {
                return new \Exception('Je potrebné vyplniť všetky povinné položky!');
            }

            if ($question->type == 'shortText' || $question->type == 'longText') {
                $answerLength = strlen($answer['answer'][0]);
                if (
                    ($question->minSelection && $question->minSelection > $answerLength) ||
                    ($question->maxSelection && $question->maxSelection < $answerLength)
                ) {
                    return new \Exception('Odpovede nespĺňajú stanovené kritéria!');
                }
            }

            if ($question['type'] == 'choiceList' || $question['type'] == 'selectList') {
                $answerLength = count($answer['answer']);
                if ($answerLength > 1) {
                    return new \Exception('Pri tomto type otázky je povolená iba jedna možnosť odpovede!');
                }

                if (!$question->choices()->find($answer['answer'][0])->exists()) {
                    return new \Exception('Nie je možné odpovedať neznámou možnosťou!');
                }
            }

            if ($question['type'] == 'multichoice') {
                $choiceIds = [];
                foreach ($question['answer'] as $choice) {
                    array_push($choiceIds, $choice);
                }

                $questionFilteredChoicesCount = $question->choices()->count();
                $sendChoicesCount = $question->choices()->whereIn('id', $choiceIds)->count();

                if ($questionFilteredChoicesCount !== $sendChoicesCount) {
                    return new \Exception('Nie je možné odpovedať neznámou možnosťou!');
                }

                if (
                    ($question->minSelection && $question->minSelection > $sendChoicesCount) ||
                    ($question->maxSelection && $question->maxSelection < $sendChoicesCount)
                ) {
                    return new \Exception('Odpovede nespĺňajú stanovené kritéria!');
                }
            }
        }

        // saving
        foreach ($answers as $answer) {
            $question = Question::findOrFail($answer['questionId']);

            if ($question->type == 'shortText' || $question->type == 'longText') {
                $choice = $question->choices()->firstOrFail();
                $answer = Answer::create([
                    'userId' => $user->id,
                    'choiceId' => $choice->id,
                    'answer' => isset($answer['answer'][0]) ? $answer['answer'][0] : '',
                ]);
            }

            if ($question->type == 'choiceList' || $question->type == 'selectList') {
                $choice = $question->choices()->find($answer['answer'][0]);
                $answer = Answer::create([
                    'userId' => $user->id,
                    'choiceId' => $choice->id,
                    'answer' => 'selected',
                ]);
            }

            if ($question->type == 'multichoice') {
                foreach ($answer['answer'] as $choiceId) {
                    $choice = $question->choices()->find($choiceId);
                    $answer = Answer::create([
                        'userId' => $user->id,
                        'choiceId' => $choice->id,
                        'answer' => 'selected',
                    ]);
                }
            }
        }
        
        return true;
    }

}